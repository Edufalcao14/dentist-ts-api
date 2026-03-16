import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { Payment } from '@/entities/payment/payment.js';
import type { CreatePaymentInput } from '@/entities/payment/create-payment-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const createPayment = async (context: Context, input: CreatePaymentInput): Promise<Payment> => {
  validateInput(input);

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const appointment = await context.repositories.appointments.getById(
    input.appointmentId,
    context.auth.tenantId,
  );
  if (!appointment) throw new NotFoundError('Appointment not found');

  return context.repositories.payments.create(input);
};

function validateInput(input: CreatePaymentInput) {
  const schema = Joi.object<CreatePaymentInput>({
    appointmentId: Joi.required(),
    amount: Joi.number().positive().required(),
    status: Joi.string().required().not().empty(),
    stripePaymentIntentId: Joi.string().optional().allow(null),
    paymentMethod: Joi.string().optional().allow(null),
  });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
