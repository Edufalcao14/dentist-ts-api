import Joi from 'joi';
import type { AppContext } from '@/libs/context/index.js';
import type { SignInInput } from '@/entities/auth/sign-in-input.js';
import type { AuthPayload } from '@/entities/user/auth-payload.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';

export const signIn = async (
  ctx: AppContext,
  input: SignInInput
): Promise<AuthPayload> => {
  validateInput(input);

  let tokens;
  try {
    tokens = await ctx.gateways.iam.signIn(input.email, input.password);
  } catch {
    throw new UnauthorizedError('Invalid email or password.');
  }

  if (!tokens.firebaseUid) {
    throw new UnauthorizedError('Invalid email or password.');
  }

  const user = await ctx.repositories.users.getByFirebaseUid(tokens.firebaseUid);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password.');
  }

  return {
    refreshToken: tokens.refreshToken ?? '',
    accessToken: tokens.accessToken ?? '',
    user,
  };
};

function validateInput(input: SignInInput) {
  const schema = Joi.object<SignInInput>({
    email: Joi.string().email().required().not().empty(),
    password: Joi.string().required().not().empty(),
  });
  const { error } = schema.validate(input);
  if (error) {
    throw new BadUserInputError(error.message);
  }
}
