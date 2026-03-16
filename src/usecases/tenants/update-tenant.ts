import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { Tenant } from '@/entities/tenant/tenant.js';
import type { UpdateTenantInput } from '@/entities/tenant/update-tenant-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';
import { ForbiddenError } from '@/entities/errors/forbidden-error.js';

export const updateTenant = async (context: Context, input: UpdateTenantInput): Promise<Tenant> => {
  validateInput(input);

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  if (context.auth.tenantId !== input.id) {
    throw new ForbiddenError('Access denied to this tenant');
  }

  const existing = await context.repositories.tenants.getById(input.id);
  if (!existing) throw new NotFoundError('Tenant not found');

  return context.repositories.tenants.update(input);
};

function validateInput(input: UpdateTenantInput) {
  const schema = Joi.object<UpdateTenantInput>({
    id: Joi.required(),
    name: Joi.string().optional(),
    planType: Joi.string().optional(),
    planStatus: Joi.string().optional(),
    address: Joi.string().optional().allow(null),
    cnpj: Joi.string().optional().allow(null),
    email: Joi.string().email().optional().allow(null),
    phone: Joi.string().optional().allow(null),
    stripeCustomerId: Joi.string().optional().allow(null),
  });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
