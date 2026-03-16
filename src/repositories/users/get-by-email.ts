import type { PrismaClient } from '@prisma/client';
import type { User } from '@/entities/user/user.js';
import { toEntity } from './mappers/user.mapper.js';

export const initGetUserByEmailRepository = (prisma: PrismaClient) => {
  return async (email: string, tenantId: bigint): Promise<User | null> => {
    const model = await prisma.user.findFirst({
      where: { email, tenantId, deletedAt: null },
    });
    return model ? toEntity(model) : null;
  };
};
