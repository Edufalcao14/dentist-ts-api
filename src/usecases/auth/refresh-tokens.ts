import Joi from 'joi';
import type { AppContext } from '@/libs/context/index.js';
import type { RefreshTokenInput } from '@/entities/auth/refresh-token-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import type { AuthTokensEntity } from '@/entities/auth/auth-tokens.js';

export const refreshTokens = async (
  ctx: AppContext,
  input: RefreshTokenInput
): Promise<AuthTokensEntity> => {
  // Validation
  validateInput(input);

  return ctx.gateways.iam.refreshToken(input.refreshToken);
};

function validateInput(input: RefreshTokenInput) {
  const schema = Joi.object<RefreshTokenInput>({
    refreshToken: Joi.string().required().not().empty(),
  });
  const { error } = schema.validate(input);
  if (error) {
    throw new BadUserInputError(error.message);
  }
}
