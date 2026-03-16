import type { AppContext as Context } from '@/libs/context/index.js';
import type { Service } from '@/entities/service/service.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const getServiceById = async (context: Context, id: bigint): Promise<Service> => {
  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const service = await context.repositories.services.getById(id, context.auth.tenantId);
  if (!service) throw new NotFoundError('Service not found');

  return service;
};
