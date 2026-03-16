import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { Service } from '@/entities/service/service.js';
import type { UpdateServiceInput } from '@/entities/service/update-service-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const updateService = async (context: Context, input: UpdateServiceInput): Promise<Service> => {
  validateInput(input);

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const existing = await context.repositories.services.getById(input.id, context.auth.tenantId);
  if (!existing) throw new NotFoundError('Service not found');

  return context.repositories.services.update(input);
};

function validateInput(input: UpdateServiceInput) {
  const schema = Joi.object<UpdateServiceInput>({
    id: Joi.required(),
    name: Joi.string().optional(),
    code: Joi.string().optional().allow(null),
    price: Joi.number().positive().optional(),
    durationMinutes: Joi.number().integer().positive().optional(),
  });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
