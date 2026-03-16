import type { AppContext as Context } from '@/libs/context/index.js';
import type { Dentist } from '@/entities/dentist/dentist.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const getDentistById = async (context: Context, id: bigint): Promise<Dentist> => {
  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const dentist = await context.repositories.dentists.getById(id, context.auth.tenantId);
  if (!dentist) throw new NotFoundError('Dentist not found');

  return dentist;
};
