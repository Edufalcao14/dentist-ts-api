import type { PrismaClient } from '@prisma/client';
import type { Tenant } from '@/entities/tenant/tenant.js';
import type { UpdateTenantInput } from '@/entities/tenant/update-tenant-input.js';
import { toEntity } from './mappers/tenant.mapper.js';

export const initUpdateTenantRepository = (prisma: PrismaClient) => {
  return async (data: UpdateTenantInput): Promise<Tenant> => {
    const model = await prisma.tenant.update({
      where: { id: data.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.planType !== undefined && { planType: data.planType }),
        ...(data.planStatus !== undefined && { planStatus: data.planStatus }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.cnpj !== undefined && { cnpj: data.cnpj }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.stripeCustomerId !== undefined && { stripeCustomerId: data.stripeCustomerId }),
      },
    });
    return toEntity(model);
  };
};
