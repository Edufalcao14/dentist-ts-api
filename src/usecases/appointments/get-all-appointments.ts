import type { AppContext as Context } from '@/libs/context/index.js';
import type { Appointment } from '@/entities/appointment/appointment.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';

export const getAllAppointments = async (context: Context): Promise<Appointment[]> => {
  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  return context.repositories.appointments.getAll(context.auth.tenantId);
};
