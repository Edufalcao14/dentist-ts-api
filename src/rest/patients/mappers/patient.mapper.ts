import type { Patient } from '@/entities/patient/patient.js';
import type { PatientDto } from '../dtos/patient.dto.js';

export const toDto = (entity: Patient): PatientDto => {
  return {
    id: entity.id.toString(),
    tenantId: entity.tenantId.toString(),
    userId: entity.userId.toString(),
    cpf: entity.cpf,
    birthdate: entity.birthdate ? entity.birthdate.toISOString() : null,
    allergies: entity.allergies,
    medicalNotes: entity.medicalNotes,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
    deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : null,
  };
};
