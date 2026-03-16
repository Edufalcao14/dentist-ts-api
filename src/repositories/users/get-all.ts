import type { PrismaClient } from '@prisma/client';
import type { User } from '@/entities/user/user.js';
import { toEntity } from './mappers/user.mapper.js';

export const initGetAllUsersRepository = (prisma: PrismaClient) => {
  return async (tenantId: bigint): Promise<User[]> => {
    const models = await prisma.user.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return models.map(toEntity);
  };
};
