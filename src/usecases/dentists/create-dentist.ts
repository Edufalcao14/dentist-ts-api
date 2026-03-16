import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { Dentist } from '@/entities/dentist/dentist.js';
import type { CreateDentistInput } from '@/entities/dentist/create-dentist-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { BadRequestError } from '@/entities/errors/bad-request-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const createDentist = async (context: Context, input: CreateDentistInput): Promise<Dentist> => {
  validateInput(input);

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const user = await context.repositories.users.getById(input.userId, context.auth.tenantId);
  if (!user) throw new NotFoundError('User not found in this tenant');

  const existing = await context.repositories.dentists.getAll(context.auth.tenantId);
  const alreadyDentist = existing.find((d) => d.userId === input.userId);
  if (alreadyDentist) throw new BadRequestError('This user already has a dentist profile');

  return context.repositories.dentists.create(input);
};

function validateInput(input: CreateDentistInput) {
  const schema = Joi.object<CreateDentistInput>({
    userId: Joi.required(),
    croNumber: Joi.string().optional().allow(null),
    specialization: Joi.string().optional().allow(null),
  });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
