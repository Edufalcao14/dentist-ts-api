import type { User } from './user.js';

export type AuthPayload = {
  user: User;
  refreshToken: string;
  accessToken: string;
};
