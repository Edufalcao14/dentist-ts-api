import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { AppointmentService } from '@/entities/appointment-service/appointment-service.js';
import type { UpdateAppointmentServiceInput } from '@/entities/appointment-service/update-appointment-service-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const updateAppointmentService = async (
  context: Context,
  input: UpdateAppointmentServiceInput,
): Promise<AppointmentService> => {
  validateInput(input);

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const existing = await context.repositories.appointmentServices.getById(input.id, context.auth.tenantId);
  if (!existing) throw new NotFoundError('Appointment service not found');

  return context.repositories.appointmentServices.update(input);
};

function validateInput(input: UpdateAppointmentServiceInput) {
  const schema = Joi.object<UpdateAppointmentServiceInput>({
    id: Joi.required(),
    quantity: Joi.number().integer().positive().optional(),
    unitPrice: Joi.number().positive().optional(),
    lineTotal: Joi.number().positive().optional(),
    notes: Joi.string().optional().allow(null),
  });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
