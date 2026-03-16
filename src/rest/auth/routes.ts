import { Router, type RequestHandler } from 'express';
import { initAuthControllers } from './controllers/auth.controller.js';
import type { Usecases } from '@/usecases/index.js';

export const initAuthRoutes = (usecases: Usecases) => {
  const controllers = initAuthControllers(usecases);
  const router = Router();

  router.post('/sign-in', controllers.signIn as unknown as RequestHandler);
  router.post('/refresh', controllers.refreshTokens as unknown as RequestHandler);
  router.post('/forgot-password', controllers.forgotPassword as unknown as RequestHandler);

  return router;
};
