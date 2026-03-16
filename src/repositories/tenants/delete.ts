import type { PrismaClient } from '@prisma/client';

export const initDeleteTenantRepository = (prisma: PrismaClient) => {
  return async (id: bigint): Promise<void> => {
    await prisma.tenant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  };
};
