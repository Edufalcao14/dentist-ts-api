import { signIn } from './sign-in.js';
import { refreshTokens } from './refresh-tokens.js';
import { forgotPassword } from './forgot-password.js';

export const initAuthUsecases = () => {
  return {
    signIn,
    refreshTokens,
    forgotPassword,
  };
};

export type AuthUsecases = ReturnType<typeof initAuthUsecases>;
