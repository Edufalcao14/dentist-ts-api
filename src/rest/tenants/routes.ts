import { Router, type RequestHandler } from 'express';
import type { Usecases } from '@/usecases/index.js';
import { initTenantControllers } from './controllers/index.js';

export const initTenantRoutes = (usecases: Usecases) => {
  const controllers = initTenantControllers(usecases);
  const router = Router();

  router.post('/', controllers.create as unknown as RequestHandler);
  router.get('/:id', controllers.getById as unknown as RequestHandler);
  router.patch('/:id', controllers.update as unknown as RequestHandler);
  router.delete('/:id', controllers.delete as unknown as RequestHandler);

  return router;
};
