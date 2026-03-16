import type { PrismaClient } from '@prisma/client';
import { initUserRepositories } from './users/index.js';
import { initTenantRepositories } from './tenants/index.js';
import { initDentistRepositories } from './dentists/index.js';
import { initPatientRepositories } from './patients/index.js';
import { initServiceRepositories } from './services/index.js';
import { initAppointmentRepositories } from './appointments/index.js';
import { initAppointmentServiceRepositories } from './appointment-services/index.js';
import { initPaymentRepositories } from './payments/index.js';

export const initRepositories = (prisma: PrismaClient) => {
  return {
    users: initUserRepositories(prisma),
    tenants: initTenantRepositories(prisma),
    dentists: initDentistRepositories(prisma),
    patients: initPatientRepositories(prisma),
    services: initServiceRepositories(prisma),
    appointments: initAppointmentRepositories(prisma),
    appointmentServices: initAppointmentServiceRepositories(prisma),
    payments: initPaymentRepositories(prisma),
  };
};

export type Repositories = ReturnType<typeof initRepositories>;
