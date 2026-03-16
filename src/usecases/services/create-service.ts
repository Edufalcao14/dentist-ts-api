import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { Service } from '@/entities/service/service.js';
import type { CreateServiceInput } from '@/entities/service/create-service-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';

export const createService = async (context: Context, input: CreateServiceInput): Promise<Service> => {
  validateInput(input);

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  return context.repositories.services.create({ ...input, tenantId: context.auth.tenantId });
};

function validateInput(input: CreateServiceInput) {
  const schema = Joi.object<CreateServiceInput>({
    tenantId: Joi.optional(),
    name: Joi.string().required().not().empty(),
    price: Joi.number().positive().required(),
    durationMinutes: Joi.number().integer().positive().required(),
    code: Joi.string().optional().allow(null),
  });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
