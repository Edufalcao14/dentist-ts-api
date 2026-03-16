import type { PrismaClient } from '@prisma/client';
import { initCreateTenantRepository } from './create.js';
import { initGetAllTenantsRepository } from './get-all.js';
import { initGetTenantByIdRepository } from './get-by-id.js';
import { initUpdateTenantRepository } from './update.js';
import { initDeleteTenantRepository } from './delete.js';

export const initTenantRepositories = (prisma: PrismaClient) => {
  return {
    create: initCreateTenantRepository(prisma),
    getAll: initGetAllTenantsRepository(prisma),
    getById: initGetTenantByIdRepository(prisma),
    update: initUpdateTenantRepository(prisma),
    delete: initDeleteTenantRepository(prisma),
  };
};

export type TenantRepositories = ReturnType<typeof initTenantRepositories>;
