import admin from 'firebase-admin';
import * as client from 'firebase/app';
import * as clientAuth from 'firebase/auth';
import type { Config } from '@/libs/config/index.js';
import type { Logger } from '@/libs/loggers/index.js';
import { UnknownError } from '@/entities/errors/unknown-error.js';
import { BadRequestError } from '@/entities/errors/bad-request-error.js';
import type { AuthTokensEntity } from '@/entities/auth/auth-tokens.js';
import { BusinessError } from '@/entities/errors/business-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import type { AuthContext } from '@/libs/context/index.js';
import type { DecodedIdToken } from 'firebase-admin/auth';

type ImpersonateClaims =
  | {
      is_impersonating: true;
      target_user_id: string;
    }
  | {
      is_impersonating: false;
      target_user_id: null;
    };

const GENERIC_AUTH_FAILED = 'Invalid email or password.';
const GENERIC_REQUEST_FAILED = 'Invalid request.';
const GENERIC_SESSION_FAILED = 'Unable to refresh session. Please sign in again.';

export const initIAMGateway = (config: Config, logger: Logger) => {
  // Init firebase admin
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebase.projectId,
      clientEmail: config.firebase.credentials.clientEmail,
      privateKey: config.firebase.credentials.privateKey,
    }),
  });

  // Init firebase client
  const clientApp = client.initializeApp({
    apiKey: config.firebase.client.apiKey,
    authDomain: config.firebase.client.authDomain,
    projectId: config.firebase.projectId,
    storageBucket: config.firebase.client.storageBucket,
    messagingSenderId: config.firebase.client.messagingSenderId,
    appId: config.firebase.client.appId,
  });

  const createUser = async (
    email: string,
    password: string,
    displayName?: string,
  ): Promise<string> => {
    try {
      const user = await admin.auth().createUser({
        email: email,
        password: password,
        emailVerified: true,
        ...(displayName != null && { displayName }),
      });

      return user.uid;
    } catch (err: unknown) {
      const error = err as { code?: string; message: string; stack?: string };
      logger.error('IAM createUser failed', { email, code: error.code, message: error.message, stack: error.stack });
      if (error.code === 'auth/email-already-exists') {
        throw new BadRequestError('A user with this email already exists.', { email });
      }
      throw new BadRequestError('Unable to create account. Please try again.', { email });
    }
  };

  const signIn = async (
    email: string,
    password: string,
  ): Promise<AuthTokensEntity> => {
    try {
      const auth = clientAuth.getAuth(clientApp);
      const { user } = await clientAuth.signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (!user.emailVerified) {
        throw new BadRequestError('Email not verified', { email });
      }

      const { token, expirationTime } = await user.getIdTokenResult();
      return {
        accessToken: token,
        refreshToken: user.refreshToken,
        expiredAt: new Date(expirationTime),
        firebaseUid: user.uid,
      };
    } catch (err: unknown) {
      const error = err as { code?: string; message: string; stack?: string };
      if (err instanceof BusinessError) {
        throw err;
      }
      logger.error('IAM signIn failed', { email, code: error.code, message: error.message, stack: error.stack });
      throw new UnauthorizedError(GENERIC_AUTH_FAILED, { email });
    }
  };

  const getAuthAndValidateToken = async (
    accessToken: string,
  ): Promise<AuthContext> => {
    try {
      const decodedToken = (await admin
        .auth()
        .verifyIdToken(accessToken)) as DecodedIdToken & ImpersonateClaims;
      if (decodedToken.is_impersonating) {
        return {
          isAuthenticated: true,
          tenantResolved: false,
          isImpersonating: true,
          firebaseUid: decodedToken.target_user_id,
          impersonatorUserId: decodedToken.uid,
        };
      }

      return {
        isAuthenticated: true,
        tenantResolved: false,
        isImpersonating: false,
        firebaseUid: decodedToken.uid,
      };
    } catch (err: unknown) {
      const error = err as { code?: string; message: string; stack?: string };
      logger.error('IAM getAuthAndValidateToken failed', { code: error.code, message: error.message, stack: error.stack });
      if (error.code === 'auth/id-token-expired') {
        throw new UnauthorizedError('Access token expired');
      }
      if (error.code === 'auth/id-token-revoked') {
        throw new UnauthorizedError('Access token revoked');
      }
      throw new UnauthorizedError('Invalid or expired token.');
    }
  };

  const _refreshToken = async (
    refreshToken: string,
  ): Promise<AuthTokensEntity> => {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${config.firebase.client.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      },
    );
    if (!response.ok) {
      const { error: resError } = await response.json();
      logger.error('IAM refreshToken failed', { message: resError?.message });
      throw new UnauthorizedError(GENERIC_SESSION_FAILED);
    }

    const data = await response.json();
    const { id_token, refresh_token, expires_in } = data;

    const expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + Number(expires_in));

    return {
      accessToken: id_token,
      refreshToken: refresh_token,
      expiredAt,
    };
  };

  const impersonateUser = async (
    auth: AuthContext,
    refreshToken: string,
    userId: string,
  ): Promise<AuthTokensEntity> => {
    if (!auth.isAuthenticated) {
      throw new UnauthorizedError('User not authenticated');
    }

    try {
      const claims: ImpersonateClaims = {
        is_impersonating: true,
        target_user_id: userId,
      };
      // Use the authenticated user's ID to set custom claims
      const authenticatedUserId = auth.isImpersonating
        ? auth.impersonatorUserId
        : (auth as { firebaseUid: string }).firebaseUid;
      await admin.auth().setCustomUserClaims(authenticatedUserId, claims);
      return _refreshToken(refreshToken);
    } catch (err: unknown) {
      const error = err as { code?: string; message: string; stack?: string };
      if (err instanceof BusinessError) {
        throw err;
      }
      logger.error('IAM impersonateUser failed', { code: error.code, message: error.message, stack: error.stack });
      throw new UnknownError('An error occurred. Please try again.');
    }
  };

  const stopImpersonatingUser = async (
    auth: AuthContext,
    refreshToken: string,
  ): Promise<AuthTokensEntity> => {
    if (!auth.isAuthenticated) {
      throw new UnauthorizedError('User not authenticated');
    }
    if (!auth.isImpersonating) {
      throw new UnauthorizedError('User not impersonating');
    }

    try {
      const claims: ImpersonateClaims = {
        is_impersonating: false,
        target_user_id: null,
      };
      await admin.auth().setCustomUserClaims(auth.impersonatorUserId, claims);
      return _refreshToken(refreshToken);
    } catch (err: unknown) {
      const error = err as { code?: string; message: string; stack?: string };
      if (err instanceof BusinessError) {
        throw err;
      }
      logger.error('IAM stopImpersonatingUser failed', { code: error.code, message: error.message, stack: error.stack });
      throw new UnknownError('An error occurred. Please try again.');
    }
  };
  const sendPasswordResetEmail = async (email: string): Promise<void> => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${config.firebase.client.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestType: 'PASSWORD_RESET',
          email,
        }),
      },
    );

    if (!response.ok) {
      const { error: resError } = await response.json();
      logger.error('IAM sendPasswordResetEmail failed', { email, message: resError?.message });
      throw new BadRequestError(GENERIC_REQUEST_FAILED, { email });
    }
  };

  return {
    createUser,
    signIn,
    getAuthAndValidateToken,
    refreshToken: _refreshToken,
    impersonateUser,
    stopImpersonatingUser,
    sendPasswordResetEmail,
  };
};

export type IAMGateway = ReturnType<typeof initIAMGateway>;
