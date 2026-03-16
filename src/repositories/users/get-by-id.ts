import type { PrismaClient } from '@prisma/client';
import type { User } from '@/entities/user/user.js';
import { toEntity } from './mappers/user.mapper.js';

export const initGetUserByIdRepository = (prisma: PrismaClient) => {
  return async (id: bigint, tenantId: bigint): Promise<User | null> => {
    const model = await prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    return model ? toEntity(model) : null;
  };
};
