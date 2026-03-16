import type { PrismaClient } from '@prisma/client';

export const initDeleteServiceRepository = (prisma: PrismaClient) => {
  return async (id: bigint): Promise<void> => {
    await prisma.service.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  };
};
