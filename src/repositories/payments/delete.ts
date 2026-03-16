import type { PrismaClient } from '@prisma/client';

export const initDeletePaymentRepository = (prisma: PrismaClient) => {
  return async (id: bigint): Promise<void> => {
    await prisma.payment.delete({ where: { id } });
  };
};
