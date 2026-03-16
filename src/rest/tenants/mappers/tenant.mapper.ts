import type { Tenant } from '@/entities/tenant/tenant.js';
import type { TenantDto } from '../dtos/tenant.dto.js';

export const toDto = (entity: Tenant): TenantDto => {
  return {
    id: entity.id.toString(),
    name: entity.name,
    address: entity.address,
    cnpj: entity.cnpj,
    email: entity.email,
    phone: entity.phone,
    stripeCustomerId: entity.stripeCustomerId,
    planType: entity.planType,
    planStatus: entity.planStatus,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
    deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : null,
  };
};
