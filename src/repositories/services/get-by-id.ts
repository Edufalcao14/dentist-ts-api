import type { PrismaClient } from '@prisma/client';
import type { Service } from '@/entities/service/service.js';
import { toEntity } from './mappers/service.mapper.js';

export const initGetServiceByIdRepository = (prisma: PrismaClient) => {
  return async (id: bigint, tenantId: bigint): Promise<Service | null> => {
    const model = await prisma.service.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    return model ? toEntity(model) : null;
  };
};
