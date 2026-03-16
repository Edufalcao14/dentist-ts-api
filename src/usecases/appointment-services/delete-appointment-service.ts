import type { AppContext as Context } from '@/libs/context/index.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const deleteAppointmentService = async (context: Context, id: bigint): Promise<void> => {
  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const existing = await context.repositories.appointmentServices.getById(id, context.auth.tenantId);
  if (!existing) throw new NotFoundError('Appointment service not found');

  await context.repositories.appointmentServices.delete(id);
};
