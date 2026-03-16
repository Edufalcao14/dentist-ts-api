import type { AppContext as Context } from '@/libs/context/index.js';
import type { AppointmentService } from '@/entities/appointment-service/appointment-service.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const getAppointmentServiceById = async (
  context: Context,
  id: bigint,
): Promise<AppointmentService> => {
  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const item = await context.repositories.appointmentServices.getById(id, context.auth.tenantId);
  if (!item) throw new NotFoundError('Appointment service not found');

  return item;
};
