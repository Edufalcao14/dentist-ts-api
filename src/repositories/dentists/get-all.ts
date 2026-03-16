import type { PrismaClient } from '@prisma/client';
import type { Dentist } from '@/entities/dentist/dentist.js';
import { toEntity } from './mappers/dentist.mapper.js';

export const initGetAllDentistsRepository = (prisma: PrismaClient) => {
  return async (tenantId: bigint): Promise<Dentist[]> => {
    const models = await prisma.dentist.findMany({
      where: {
        user: { tenantId, deletedAt: null },
      },
      orderBy: { createdAt: 'desc' },
    });
    return models.map(toEntity);
  };
};
