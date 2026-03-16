import type { AppContext as Context } from '@/libs/context/index.js';
import type { Payment } from '@/entities/payment/payment.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const getAllPayments = async (context: Context, appointmentId: bigint): Promise<Payment[]> => {
  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const appointment = await context.repositories.appointments.getById(
    appointmentId,
    context.auth.tenantId,
  );
  if (!appointment) throw new NotFoundError('Appointment not found');

  return context.repositories.payments.getAll(appointmentId, context.auth.tenantId);
};
