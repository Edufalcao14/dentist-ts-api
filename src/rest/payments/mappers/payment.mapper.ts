import type { Payment } from '@/entities/payment/payment.js';
import type { PaymentDto } from '../dtos/payment.dto.js';

export const toDto = (entity: Payment): PaymentDto => {
  return {
    id: entity.id.toString(),
    appointmentId: entity.appointmentId.toString(),
    amount: entity.amount.toString(),
    stripePaymentIntentId: entity.stripePaymentIntentId,
    status: entity.status,
    paymentMethod: entity.paymentMethod,
    createdAt: entity.createdAt.toISOString(),
  };
};
