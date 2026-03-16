import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { Appointment } from '@/entities/appointment/appointment.js';
import type { CreateAppointmentInput } from '@/entities/appointment/create-appointment-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const createAppointment = async (context: Context, input: CreateAppointmentInput): Promise<Appointment> => {
  validateInput(input);

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const patient = await context.repositories.patients.getById(input.patientId, context.auth.tenantId);
  if (!patient) throw new NotFoundError('Patient not found in this tenant');

  const dentist = await context.repositories.dentists.getById(input.dentistId, context.auth.tenantId);
  if (!dentist) throw new NotFoundError('Dentist not found in this tenant');

  return context.repositories.appointments.create({ ...input, tenantId: context.auth.tenantId });
};

function validateInput(input: CreateAppointmentInput) {
  const schema = Joi.object<CreateAppointmentInput>({
    tenantId: Joi.optional(),
    patientId: Joi.required(),
    dentistId: Joi.required(),
    dateTime: Joi.date().required(),
    status: Joi.string().required().not().empty(),
    notes: Joi.string().optional().allow(null),
    totalAmount: Joi.number().positive().optional().allow(null),
  });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
