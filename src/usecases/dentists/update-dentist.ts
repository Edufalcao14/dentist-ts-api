import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { Dentist } from '@/entities/dentist/dentist.js';
import type { UpdateDentistInput } from '@/entities/dentist/update-dentist-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const updateDentist = async (context: Context, input: UpdateDentistInput): Promise<Dentist> => {
  validateInput(input);

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const existing = await context.repositories.dentists.getById(input.id, context.auth.tenantId);
  if (!existing) throw new NotFoundError('Dentist not found');

  return context.repositories.dentists.update(input);
};

function validateInput(input: UpdateDentistInput) {
  const schema = Joi.object<UpdateDentistInput>({
    id: Joi.required(),
    croNumber: Joi.string().optional().allow(null),
    specialization: Joi.string().optional().allow(null),
  });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
