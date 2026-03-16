import type { Patient } from '@/entities/patient/patient.js';
import type { Patient as PatientModel } from '@prisma/client';

export const toEntity = (model: PatientModel): Patient => {
  return {
    id: model.id,
    tenantId: model.tenantId,
    userId: model.userId,
    cpf: model.cpf,
    birthdate: model.birthdate,
    allergies: model.allergies,
    medicalNotes: model.medicalNotes,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
    deletedAt: model.deletedAt,
  };
};
