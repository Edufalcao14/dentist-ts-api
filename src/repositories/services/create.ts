import type { PrismaClient } from '@prisma/client';
import type { Service } from '@/entities/service/service.js';
import type { CreateServiceInput } from '@/entities/service/create-service-input.js';
import { toEntity } from './mappers/service.mapper.js';

export const initCreateServiceRepository = (prisma: PrismaClient) => {
  return async (data: CreateServiceInput): Promise<Service> => {
    const model = await prisma.service.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        price: data.price,
        durationMinutes: data.durationMinutes,
        code: data.code ?? null,
      },
    });
    return toEntity(model);
  };
};
