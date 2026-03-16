import type { AppContext as Context } from '@/libs/context/index.js';
import type { User } from '@/entities/user/user.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';

export const getAllUsers = async (context: Context): Promise<User[]> => {
  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  return context.repositories.users.getAll(context.auth.tenantId);
};
