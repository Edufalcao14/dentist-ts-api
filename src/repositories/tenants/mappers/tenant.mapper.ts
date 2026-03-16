import type { Tenant } from '@/entities/tenant/tenant.js';
import type { Tenant as TenantModel } from '@prisma/client';

export const toEntity = (model: TenantModel): Tenant => {
  return {
    id: model.id,
    name: model.name,
    address: model.address,
    cnpj: model.cnpj,
    email: model.email,
    phone: model.phone,
    stripeCustomerId: model.stripeCustomerId,
    planType: model.planType,
    planStatus: model.planStatus,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
    deletedAt: model.deletedAt,
  };
};
