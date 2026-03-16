import type { AppContext as Context } from '@/libs/context/index.js';
import type { Dentist } from '@/entities/dentist/dentist.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';

export const getAllDentists = async (context: Context): Promise<Dentist[]> => {
  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  return context.repositories.dentists.getAll(context.auth.tenantId);
};
