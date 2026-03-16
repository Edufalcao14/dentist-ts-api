import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { Tenant } from '@/entities/tenant/tenant.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';
import { ForbiddenError } from '@/entities/errors/forbidden-error.js';

export const getTenantById = async (context: Context, id: bigint): Promise<Tenant> => {
  validateInput({ id });

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  if (context.auth.tenantId !== id) {
    throw new ForbiddenError('Access denied to this tenant');
  }

  const tenant = await context.repositories.tenants.getById(id);
  if (!tenant) throw new NotFoundError('Tenant not found');

  return tenant;
};

function validateInput(input: { id: bigint }) {
  const schema = Joi.object({ id: Joi.required() });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
