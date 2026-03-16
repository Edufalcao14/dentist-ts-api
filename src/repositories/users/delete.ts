import type { PrismaClient } from '@prisma/client';

export const initDeleteUserRepository = (prisma: PrismaClient) => {
  return async (id: bigint): Promise<void> => {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  };
};
