import type { Request, Response, NextFunction } from 'express';
import type { BaseContext } from '@/libs/context/index.js';
import type { AuthContext } from '@/libs/context/index.js';
import { createRequestContext } from '@/libs/context/index.js';

export const createAuthMiddleware = (baseContext: BaseContext) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    let authContext: Partial<AuthContext>;

    if (token) {
      try {
        // Validate token with Firebase via IAM gateway
        authContext = await baseContext.gateways.iam.getAuthAndValidateToken(token);
        // Returns: { isAuthenticated: true, tenantResolved: false, firebaseUid: "...", isImpersonating: false }
      } catch (error) {
        // Token validation failed (invalid, expired, revoked)
        baseContext.logger.warn('Token validation failed', { error });
        authContext = { isAuthenticated: false };
      }
    } else {
      // No token provided - public endpoint
      authContext = { isAuthenticated: false };
    }

    // Create request context with authentication info
    const context = createRequestContext(baseContext, authContext);
    (req as Request & { context: typeof context }).context = context;
    
    next();
  };
};
