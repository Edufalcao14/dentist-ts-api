import type { Dentist } from '@/entities/dentist/dentist.js';
import type { Dentist as DentistModel } from '@prisma/client';

export const toEntity = (model: DentistModel): Dentist => {
  return {
    id: model.id,
    userId: model.userId,
    croNumber: model.croNumber,
    specialization: model.specialization,
    createdAt: model.createdAt,
  };
};
