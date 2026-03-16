import type { PrismaClient } from '@prisma/client';
import { initCreateAppointmentRepository } from './create.js';
import { initGetAllAppointmentsRepository } from './get-all.js';
import { initGetAppointmentByIdRepository } from './get-by-id.js';
import { initUpdateAppointmentRepository } from './update.js';
import { initDeleteAppointmentRepository } from './delete.js';

export const initAppointmentRepositories = (prisma: PrismaClient) => {
  return {
    create: initCreateAppointmentRepository(prisma),
    getAll: initGetAllAppointmentsRepository(prisma),
    getById: initGetAppointmentByIdRepository(prisma),
    update: initUpdateAppointmentRepository(prisma),
    delete: initDeleteAppointmentRepository(prisma),
  };
};

export type AppointmentRepositories = ReturnType<typeof initAppointmentRepositories>;
