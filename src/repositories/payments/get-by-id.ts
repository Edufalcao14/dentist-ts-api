import type { PrismaClient } from '@prisma/client';
import type { Payment } from '@/entities/payment/payment.js';
import { toEntity } from './mappers/payment.mapper.js';

export const initGetPaymentByIdRepository = (prisma: PrismaClient) => {
  return async (id: bigint, tenantId: bigint): Promise<Payment | null> => {
    const model = await prisma.payment.findFirst({
      where: {
        id,
        appointment: { tenantId, deletedAt: null },
      },
    });
    return model ? toEntity(model) : null;
  };
};
