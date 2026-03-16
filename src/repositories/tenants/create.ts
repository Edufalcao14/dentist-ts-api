import type { PrismaClient } from '@prisma/client';
import type { Tenant } from '@/entities/tenant/tenant.js';
import type { CreateTenantInput } from '@/entities/tenant/create-tenant-input.js';
import { toEntity } from './mappers/tenant.mapper.js';

export const initCreateTenantRepository = (prisma: PrismaClient) => {
  return async (data: CreateTenantInput): Promise<Tenant> => {
    const model = await prisma.tenant.create({
      data: {
        name: data.name,
        planType: data.planType,
        planStatus: data.planStatus,
        address: data.address ?? null,
        cnpj: data.cnpj ?? null,
        email: data.email ?? null,
        phone: data.phone ?? null,
        stripeCustomerId: data.stripeCustomerId ?? null,
      },
    });
    return toEntity(model);
  };
};
