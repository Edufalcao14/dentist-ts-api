import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { Payment } from '@/entities/payment/payment.js';
import type { UpdatePaymentInput } from '@/entities/payment/update-payment-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const updatePayment = async (context: Context, input: UpdatePaymentInput): Promise<Payment> => {
  validateInput(input);

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const existing = await context.repositories.payments.getById(input.id, context.auth.tenantId);
  if (!existing) throw new NotFoundError('Payment not found');

  return context.repositories.payments.update(input);
};

function validateInput(input: UpdatePaymentInput) {
  const schema = Joi.object<UpdatePaymentInput>({
    id: Joi.required(),
    status: Joi.string().optional(),
    stripePaymentIntentId: Joi.string().optional().allow(null),
    paymentMethod: Joi.string().optional().allow(null),
  });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
