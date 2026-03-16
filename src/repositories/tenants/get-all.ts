import type { PrismaClient } from '@prisma/client';
import type { Tenant } from '@/entities/tenant/tenant.js';
import { toEntity } from './mappers/tenant.mapper.js';

export const initGetAllTenantsRepository = (prisma: PrismaClient) => {
  return async (): Promise<Tenant[]> => {
    const models = await prisma.tenant.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return models.map(toEntity);
  };
};
