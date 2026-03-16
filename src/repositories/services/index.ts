import type { PrismaClient } from '@prisma/client';
import { initCreateServiceRepository } from './create.js';
import { initGetAllServicesRepository } from './get-all.js';
import { initGetServiceByIdRepository } from './get-by-id.js';
import { initUpdateServiceRepository } from './update.js';
import { initDeleteServiceRepository } from './delete.js';

export const initServiceRepositories = (prisma: PrismaClient) => {
  return {
    create: initCreateServiceRepository(prisma),
    getAll: initGetAllServicesRepository(prisma),
    getById: initGetServiceByIdRepository(prisma),
    update: initUpdateServiceRepository(prisma),
    delete: initDeleteServiceRepository(prisma),
  };
};

export type ServiceRepositories = ReturnType<typeof initServiceRepositories>;
