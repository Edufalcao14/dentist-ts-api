import { Router, type RequestHandler } from 'express';
import type { Usecases } from '@/usecases/index.js';
import { initPaymentControllers } from './controllers/index.js';

export const initPaymentRoutes = (usecases: Usecases) => {
  const controllers = initPaymentControllers(usecases);
  const router = Router({ mergeParams: true });

  router.get('/', controllers.getAll as unknown as RequestHandler);
  router.get('/:id', controllers.getById as unknown as RequestHandler);
  router.post('/', controllers.create as unknown as RequestHandler);
  router.patch('/:id', controllers.update as unknown as RequestHandler);
  router.delete('/:id', controllers.delete as unknown as RequestHandler);

  return router;
};
