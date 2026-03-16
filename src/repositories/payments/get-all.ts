import type { PrismaClient } from '@prisma/client';
import type { Payment } from '@/entities/payment/payment.js';
import { toEntity } from './mappers/payment.mapper.js';

export const initGetAllPaymentsRepository = (prisma: PrismaClient) => {
  return async (appointmentId: bigint, tenantId: bigint): Promise<Payment[]> => {
    const models = await prisma.payment.findMany({
      where: {
        appointmentId,
        appointment: { tenantId, deletedAt: null },
      },
      orderBy: { createdAt: 'desc' },
    });
    return models.map(toEntity);
  };
};
