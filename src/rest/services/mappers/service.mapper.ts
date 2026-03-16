import type { Service } from '@/entities/service/service.js';
import type { ServiceDto } from '../dtos/service.dto.js';

export const toDto = (entity: Service): ServiceDto => {
  return {
    id: entity.id.toString(),
    tenantId: entity.tenantId.toString(),
    name: entity.name,
    code: entity.code,
    price: entity.price.toString(),
    durationMinutes: entity.durationMinutes,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
    deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : null,
  };
};
