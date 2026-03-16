import type { AppContext as Context } from '@/libs/context/index.js';
import type { AppointmentService } from '@/entities/appointment-service/appointment-service.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const getAllAppointmentServices = async (
  context: Context,
  appointmentId: bigint,
): Promise<AppointmentService[]> => {
  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const appointment = await context.repositories.appointments.getById(
    appointmentId,
    context.auth.tenantId,
  );
  if (!appointment) throw new NotFoundError('Appointment not found');

  return context.repositories.appointmentServices.getAll(appointmentId, context.auth.tenantId);
};
