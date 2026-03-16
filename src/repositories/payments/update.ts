import type { PrismaClient } from '@prisma/client';
import type { Payment } from '@/entities/payment/payment.js';
import type { UpdatePaymentInput } from '@/entities/payment/update-payment-input.js';
import { toEntity } from './mappers/payment.mapper.js';

export const initUpdatePaymentRepository = (prisma: PrismaClient) => {
  return async (data: UpdatePaymentInput): Promise<Payment> => {
    const model = await prisma.payment.update({
      where: { id: data.id },
      data: {
        ...(data.status !== undefined && { status: data.status }),
        ...(data.stripePaymentIntentId !== undefined && { stripePaymentIntentId: data.stripePaymentIntentId }),
        ...(data.paymentMethod !== undefined && { paymentMethod: data.paymentMethod }),
      },
    });
    return toEntity(model);
  };
};
