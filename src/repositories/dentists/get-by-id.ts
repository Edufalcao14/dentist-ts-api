import type { PrismaClient } from '@prisma/client';
import type { Dentist } from '@/entities/dentist/dentist.js';
import { toEntity } from './mappers/dentist.mapper.js';

export const initGetDentistByIdRepository = (prisma: PrismaClient) => {
  return async (id: bigint, tenantId: bigint): Promise<Dentist | null> => {
    const model = await prisma.dentist.findFirst({
      where: {
        id,
        user: { tenantId, deletedAt: null },
      },
    });
    return model ? toEntity(model) : null;
  };
};
