import type { PrismaClient } from '@prisma/client';
import { initCreateAppointmentServiceRepository } from './create.js';
import { initGetAllAppointmentServicesRepository } from './get-all.js';
import { initGetAppointmentServiceByIdRepository } from './get-by-id.js';
import { initUpdateAppointmentServiceRepository } from './update.js';
import { initDeleteAppointmentServiceRepository } from './delete.js';

export const initAppointmentServiceRepositories = (prisma: PrismaClient) => {
  return {
    create: initCreateAppointmentServiceRepository(prisma),
    getAll: initGetAllAppointmentServicesRepository(prisma),
    getById: initGetAppointmentServiceByIdRepository(prisma),
    update: initUpdateAppointmentServiceRepository(prisma),
    delete: initDeleteAppointmentServiceRepository(prisma),
  };
};

export type AppointmentServiceRepositories = ReturnType<typeof initAppointmentServiceRepositories>;
