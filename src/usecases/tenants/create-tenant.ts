import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { Tenant } from '@/entities/tenant/tenant.js';
import type { CreateTenantInput } from '@/entities/tenant/create-tenant-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';

export const createTenant = async (context: Context, input: CreateTenantInput): Promise<Tenant> => {
  validateInput(input);

  return context.repositories.tenants.create(input);
};

function validateInput(input: CreateTenantInput) {
  const schema = Joi.object<CreateTenantInput>({
    name: Joi.string().required().not().empty(),
    planType: Joi.string().required().not().empty(),
    planStatus: Joi.string().required().not().empty(),
    address: Joi.string().optional(),
    cnpj: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    stripeCustomerId: Joi.string().optional(),
  });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
