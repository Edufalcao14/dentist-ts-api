import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { Appointment } from '@/entities/appointment/appointment.js';
import type { UpdateAppointmentInput } from '@/entities/appointment/update-appointment-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const updateAppointment = async (context: Context, input: UpdateAppointmentInput): Promise<Appointment> => {
  validateInput(input);

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const existing = await context.repositories.appointments.getById(input.id, context.auth.tenantId);
  if (!existing) throw new NotFoundError('Appointment not found');

  return context.repositories.appointments.update(input);
};

function validateInput(input: UpdateAppointmentInput) {
  const schema = Joi.object<UpdateAppointmentInput>({
    id: Joi.required(),
    patientId: Joi.optional(),
    dentistId: Joi.optional(),
    dateTime: Joi.date().optional(),
    status: Joi.string().optional(),
    notes: Joi.string().optional().allow(null),
    totalAmount: Joi.number().positive().optional().allow(null),
  });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
