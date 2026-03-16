import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { User } from '@/entities/user/user.js';
import type { CreateUserInput } from '@/entities/user/create-user-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { BadRequestError } from '@/entities/errors/bad-request-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';

export const createUser = async (context: Context, input: CreateUserInput): Promise<User> => {
  validateInput(input);

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const existing = await context.repositories.users.getByEmail(input.email, input.tenantId);
  if (existing) throw new BadRequestError('A user with this email already exists.');

  const firebaseUid = await context.gateways.iam.createUser(
    input.email,
    undefined as unknown as string,
    `${input.firstName} ${input.lastName}`,
  );

  return context.repositories.users.create({ ...input, firebaseUid });
};

function validateInput(input: CreateUserInput) {
  const schema = Joi.object<CreateUserInput>({
    tenantId: Joi.required(),
    firebaseUid: Joi.string().optional(),
    role: Joi.string().required().not().empty(),
    firstName: Joi.string().required().not().empty(),
    lastName: Joi.string().required().not().empty(),
    email: Joi.string().email().required().not().empty(),
    phone: Joi.string().optional().allow(null),
    birthdate: Joi.date().optional().allow(null),
    cpf: Joi.string().optional().allow(null),
  });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
