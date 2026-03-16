import type { PrismaClient } from '@prisma/client';
import { initCreatePatientRepository } from './create.js';
import { initGetAllPatientsRepository } from './get-all.js';
import { initGetPatientByIdRepository } from './get-by-id.js';
import { initUpdatePatientRepository } from './update.js';
import { initDeletePatientRepository } from './delete.js';

export const initPatientRepositories = (prisma: PrismaClient) => {
  return {
    create: initCreatePatientRepository(prisma),
    getAll: initGetAllPatientsRepository(prisma),
    getById: initGetPatientByIdRepository(prisma),
    update: initUpdatePatientRepository(prisma),
    delete: initDeletePatientRepository(prisma),
  };
};

export type PatientRepositories = ReturnType<typeof initPatientRepositories>;
