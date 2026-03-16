import type { AppContext as Context } from '@/libs/context/index.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const deleteService = async (context: Context, id: bigint): Promise<void> => {
  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const existing = await context.repositories.services.getById(id, context.auth.tenantId);
  if (!existing) throw new NotFoundError('Service not found');

  await context.repositories.services.delete(id);
};
