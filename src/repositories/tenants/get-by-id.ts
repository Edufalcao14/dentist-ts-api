import type { PrismaClient } from '@prisma/client';
import type { Tenant } from '@/entities/tenant/tenant.js';
import { toEntity } from './mappers/tenant.mapper.js';

export const initGetTenantByIdRepository = (prisma: PrismaClient) => {
  return async (id: bigint): Promise<Tenant | null> => {
    const model = await prisma.tenant.findFirst({
      where: { id, deletedAt: null },
    });
    return model ? toEntity(model) : null;
  };
};
