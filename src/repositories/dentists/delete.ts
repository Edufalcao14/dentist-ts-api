import type { PrismaClient } from '@prisma/client';

export const initDeleteDentistRepository = (prisma: PrismaClient) => {
  return async (id: bigint): Promise<void> => {
    await prisma.dentist.delete({ where: { id } });
  };
};
