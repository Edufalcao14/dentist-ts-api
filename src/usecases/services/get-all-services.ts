import type { AppContext as Context } from '@/libs/context/index.js';
import type { Service } from '@/entities/service/service.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';

export const getAllServices = async (context: Context): Promise<Service[]> => {
  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  return context.repositories.services.getAll(context.auth.tenantId);
};
