import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { User } from '@/entities/user/user.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const getUserById = async (context: Context, id: bigint): Promise<User> => {
  validateInput({ id });

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const user = await context.repositories.users.getById(id, context.auth.tenantId);
  if (!user) throw new NotFoundError('User not found');

  return user;
};

function validateInput(input: { id: bigint }) {
  const schema = Joi.object({ id: Joi.required() });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
