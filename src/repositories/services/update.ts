import type { PrismaClient } from '@prisma/client';
import type { Service } from '@/entities/service/service.js';
import type { UpdateServiceInput } from '@/entities/service/update-service-input.js';
import { toEntity } from './mappers/service.mapper.js';

export const initUpdateServiceRepository = (prisma: PrismaClient) => {
  return async (data: UpdateServiceInput): Promise<Service> => {
    const model = await prisma.service.update({
      where: { id: data.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.code !== undefined && { code: data.code }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.durationMinutes !== undefined && { durationMinutes: data.durationMinutes }),
      },
    });
    return toEntity(model);
  };
};
