import Joi from 'joi';
import type { AppContext } from '@/libs/context/index.js';
import type { ForgotPasswordInput } from '@/entities/auth/forgot-password-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';

export const forgotPassword = async (
  ctx: AppContext,
  input: ForgotPasswordInput,
): Promise<void> => {
  // Validation
  validateInput(input);

  await ctx.gateways.iam.sendPasswordResetEmail(input.email);
};

function validateInput(input: ForgotPasswordInput) {
  const schema = Joi.object<ForgotPasswordInput>({
    email: Joi.string().email().required().not().empty(),
  });
  const { error } = schema.validate(input);
  if (error) {
    throw new BadUserInputError(error.message);
  }
}
