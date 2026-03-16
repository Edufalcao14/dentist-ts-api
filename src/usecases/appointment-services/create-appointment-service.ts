import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { AppointmentService } from '@/entities/appointment-service/appointment-service.js';
import type { CreateAppointmentServiceInput } from '@/entities/appointment-service/create-appointment-service-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const createAppointmentService = async (
  context: Context,
  input: CreateAppointmentServiceInput,
): Promise<AppointmentService> => {
  validateInput(input);

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const appointment = await context.repositories.appointments.getById(
    input.appointmentId,
    context.auth.tenantId,
  );
  if (!appointment) throw new NotFoundError('Appointment not found');

  const service = await context.repositories.services.getById(input.serviceId, context.auth.tenantId);
  if (!service) throw new NotFoundError('Service not found');

  return context.repositories.appointmentServices.create(input);
};

function validateInput(input: CreateAppointmentServiceInput) {
  const schema = Joi.object<CreateAppointmentServiceInput>({
    appointmentId: Joi.required(),
    serviceId: Joi.required(),
    quantity: Joi.number().integer().positive().required(),
    unitPrice: Joi.number().positive().required(),
    lineTotal: Joi.number().positive().required(),
    notes: Joi.string().optional().allow(null),
  });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
