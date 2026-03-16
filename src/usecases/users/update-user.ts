import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { User } from '@/entities/user/user.js';
import type { UpdateUserInput } from '@/entities/user/update-user-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const updateUser = async (context: Context, input: UpdateUserInput): Promise<User> => {
  validateInput(input);

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const existing = await context.repositories.users.getById(input.id, context.auth.tenantId);
  if (!existing) throw new NotFoundError('User not found');

  return context.repositories.users.update(input);
};

function validateInput(input: UpdateUserInput) {
  const schema = Joi.object<UpdateUserInput>({
    id: Joi.required(),
    role: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional().allow(null),
    birthdate: Joi.date().optional().allow(null),
    cpf: Joi.string().optional().allow(null),
  });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
