import type { Dentist } from '@/entities/dentist/dentist.js';
import type { DentistDto } from '../dtos/dentist.dto.js';

export const toDto = (entity: Dentist): DentistDto => {
  return {
    id: entity.id.toString(),
    userId: entity.userId.toString(),
    croNumber: entity.croNumber,
    specialization: entity.specialization,
    createdAt: entity.createdAt.toISOString(),
  };
};
