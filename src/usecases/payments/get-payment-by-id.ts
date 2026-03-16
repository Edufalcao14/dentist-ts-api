import type { AppContext as Context } from '@/libs/context/index.js';
import type { Payment } from '@/entities/payment/payment.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const getPaymentById = async (context: Context, id: bigint): Promise<Payment> => {
  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const payment = await context.repositories.payments.getById(id, context.auth.tenantId);
  if (!payment) throw new NotFoundError('Payment not found');

  return payment;
};
