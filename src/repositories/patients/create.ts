import type { PrismaClient } from '@prisma/client';
import type { Patient } from '@/entities/patient/patient.js';
import type { CreatePatientInput } from '@/entities/patient/create-patient-input.js';
import { toEntity } from './mappers/patient.mapper.js';
import { Prisma } from '@prisma/client';

export const initCreatePatientRepository = (prisma: PrismaClient) => {
  return async (data: CreatePatientInput): Promise<Patient> => {
    const model = await prisma.patient.create({
      data: {
        tenantId: data.tenantId,
        userId: data.userId,
        cpf: data.cpf ?? null,
        birthdate: data.birthdate ?? null,
        allergies: data.allergies !== undefined ? data.allergies as Prisma.InputJsonValue : Prisma.JsonNull,
        medicalNotes: data.medicalNotes !== undefined ? data.medicalNotes as Prisma.InputJsonValue : Prisma.JsonNull,
      },
    });
    return toEntity(model);
  };
};
