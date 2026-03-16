import type { AppContext as Context } from '@/libs/context/index.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';
import { ForbiddenError } from '@/entities/errors/forbidden-error.js';

export const deleteTenant = async (context: Context, id: bigint): Promise<void> => {
  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  if (context.auth.tenantId !== id) {
    throw new ForbiddenError('Access denied to this tenant');
  }

  const existing = await context.repositories.tenants.getById(id);
  if (!existing) throw new NotFoundError('Tenant not found');

  await context.repositories.tenants.delete(id);
};
