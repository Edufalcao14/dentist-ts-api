import type { Service } from '@/entities/service/service.js';
import type { Service as ServiceModel } from '@prisma/client';

export const toEntity = (model: ServiceModel): Service => {
  return {
    id: model.id,
    tenantId: model.tenantId,
    name: model.name,
    code: model.code,
    price: model.price,
    durationMinutes: model.durationMinutes,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
    deletedAt: model.deletedAt,
  };
};
