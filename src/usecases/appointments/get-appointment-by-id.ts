import type { AppContext as Context } from '@/libs/context/index.js';
import type { Appointment } from '@/entities/appointment/appointment.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const getAppointmentById = async (context: Context, id: bigint): Promise<Appointment> => {
  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const appointment = await context.repositories.appointments.getById(id, context.auth.tenantId);
  if (!appointment) throw new NotFoundError('Appointment not found');

  return appointment;
};
