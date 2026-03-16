import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { SignInDto } from '../dtos/sign-in.dto.js';
import type { AuthPayloadDto } from '../dtos/auth-payload.dto.js';
import type { RefreshTokenDto } from '../dtos/refresh-token.dto.js';
import type { AuthTokensDto } from '../dtos/auth-tokens.dto.js';
import type { ForgotPasswordDto } from '../dtos/forgot-password.dto.js';
import { toDto, authTokensToDto } from '../mappers/auth.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initAuthControllers = (usecases: Usecases) => {
  const signIn = async (
    req: Request<Record<string, string>, AuthPayloadDto, SignInDto> & { context: Context },
    res: Response<AuthPayloadDto | { message: string }>,
  ) => {
    try {
      const authPayload = await usecases.auth.signIn(req.context, {
        email: req.body.email,
        password: req.body.password,
      });

      const authPayloadDto = toDto(authPayload);

      res.status(200).json(authPayloadDto);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 400;
      res.status(status).json({ message });
    }
  };

  const refreshTokens = async (
    req: Request<Record<string, string>, AuthTokensDto, RefreshTokenDto> & { context: Context },
    res: Response<AuthTokensDto | { message: string }>,
  ) => {
    try {
      const tokens = await usecases.auth.refreshTokens(req.context, {
        refreshToken: req.body.refreshToken,
      });
      const tokensDto = authTokensToDto(tokens);
      res.status(200).json(tokensDto);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 400;
      res.status(status).json({ message });
    }
  };

  const forgotPassword = async (
    req: Request<Record<string, string>, void, ForgotPasswordDto> & { context: Context },
    res: Response<void | { message: string }>,
  ) => {
    try {
      await usecases.auth.forgotPassword(req.context, {
        email: req.body.email,
      });
      res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 400;
      res.status(status).json({ message } as never);
    }
  };

  return {
    signIn,
    refreshTokens,
    forgotPassword,
  };
};

export type AuthControllers = ReturnType<typeof initAuthControllers>;
