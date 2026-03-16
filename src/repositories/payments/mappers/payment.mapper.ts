import type { Payment } from '@/entities/payment/payment.js';
import type { Payment as PaymentModel } from '@prisma/client';

export const toEntity = (model: PaymentModel): Payment => {
  return {
    id: model.id,
    appointmentId: model.appointmentId,
    amount: model.amount,
    stripePaymentIntentId: model.stripePaymentIntentId,
    status: model.status,
    paymentMethod: model.paymentMethod,
    createdAt: model.createdAt,
  };
};
