import type { PrismaClient } from '@prisma/client';
import type { User } from '@/entities/user/user.js';
import { toEntity } from './mappers/user.mapper.js';

export const initGetUserByFirebaseUidRepository = (prisma: PrismaClient) => {
  return async (firebaseUid: string): Promise<User | null> => {
    const model = await prisma.user.findUnique({
      where: { firebaseUid },
    });
    return model ? toEntity(model) : null;
  };
};
