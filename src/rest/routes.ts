import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import type { BaseContext } from '@/libs/context/index.js';
import { createAuthMiddleware } from './middlewares/auth.middleware.js';
import { requireAuth } from './middlewares/require-auth.middleware.js';
import { requireTenantAuth } from './middlewares/require-tenant-auth.middleware.js';
import { bigIntSerializer } from './middlewares/bigint-serializer.middleware.js';
import { initUsecases } from '@/usecases/index.js';
import { initUserRoutes } from './users/routes.js';
import { initAuthRoutes } from './auth/routes.js';
import { initTenantRoutes } from './tenants/routes.js';
import { initDentistRoutes } from './dentists/routes.js';
import { initPatientRoutes } from './patients/routes.js';
import { initServiceRoutes } from './services/routes.js';
import { initAppointmentRoutes } from './appointments/routes.js';
import { initAppointmentServiceRoutes } from './appointment-services/routes.js';
import { initPaymentRoutes } from './payments/routes.js';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const createRestRoutes = (baseContext: BaseContext): Router => {
  const router = Router();
  const usecases = initUsecases();

  router.use(bigIntSerializer);
  router.use(createAuthMiddleware(baseContext));

  router.use('/auth', authLimiter, initAuthRoutes(usecases));

  router.use('/tenants', initTenantRoutes(usecases));

  router.use(requireAuth, requireTenantAuth);

  router.use('/users', initUserRoutes(usecases));
  router.use('/dentists', initDentistRoutes(usecases));
  router.use('/patients', initPatientRoutes(usecases));
  router.use('/services', initServiceRoutes(usecases));
  router.use('/appointments', initAppointmentRoutes(usecases));
  router.use('/appointments/:appointmentId/services', initAppointmentServiceRoutes(usecases));
  router.use('/appointments/:appointmentId/payments', initPaymentRoutes(usecases));

  return router;
};
