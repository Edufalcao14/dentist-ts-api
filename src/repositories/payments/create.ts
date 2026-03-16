import type { PrismaClient } from '@prisma/client';
import type { Payment } from '@/entities/payment/payment.js';
import type { CreatePaymentInput } from '@/entities/payment/create-payment-input.js';
import { toEntity } from './mappers/payment.mapper.js';

export const initCreatePaymentRepository = (prisma: PrismaClient) => {
  return async (data: CreatePaymentInput): Promise<Payment> => {
    const model = await prisma.payment.create({
      data: {
        appointmentId: data.appointmentId,
        amount: data.amount,
        status: data.status,
        stripePaymentIntentId: data.stripePaymentIntentId ?? null,
        paymentMethod: data.paymentMethod ?? null,
      },
    });
    return toEntity(model);
  };
};
