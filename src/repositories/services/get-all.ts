import type { PrismaClient } from '@prisma/client';
import type { Service } from '@/entities/service/service.js';
import { toEntity } from './mappers/service.mapper.js';

export const initGetAllServicesRepository = (prisma: PrismaClient) => {
  return async (tenantId: bigint): Promise<Service[]> => {
    const models = await prisma.service.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return models.map(toEntity);
  };
};
