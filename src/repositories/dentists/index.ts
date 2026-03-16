import type { PrismaClient } from '@prisma/client';
import { initCreateDentistRepository } from './create.js';
import { initGetAllDentistsRepository } from './get-all.js';
import { initGetDentistByIdRepository } from './get-by-id.js';
import { initUpdateDentistRepository } from './update.js';
import { initDeleteDentistRepository } from './delete.js';

export const initDentistRepositories = (prisma: PrismaClient) => {
  return {
    create: initCreateDentistRepository(prisma),
    getAll: initGetAllDentistsRepository(prisma),
    getById: initGetDentistByIdRepository(prisma),
    update: initUpdateDentistRepository(prisma),
    delete: initDeleteDentistRepository(prisma),
  };
};

export type DentistRepositories = ReturnType<typeof initDentistRepositories>;
