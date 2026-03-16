import type { PrismaClient } from '@prisma/client';

export const initDeletePatientRepository = (prisma: PrismaClient) => {
  return async (id: bigint): Promise<void> => {
    await prisma.patient.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  };
};
