import type { PrismaClient } from '@prisma/client';
import type { Patient } from '@/entities/patient/patient.js';
import type { UpdatePatientInput } from '@/entities/patient/update-patient-input.js';
import { toEntity } from './mappers/patient.mapper.js';
import { Prisma } from '@prisma/client';

export const initUpdatePatientRepository = (prisma: PrismaClient) => {
  return async (data: UpdatePatientInput): Promise<Patient> => {
    const model = await prisma.patient.update({
      where: { id: data.id },
      data: {
        ...(data.cpf !== undefined && { cpf: data.cpf }),
        ...(data.birthdate !== undefined && { birthdate: data.birthdate }),
        ...(data.allergies !== undefined && {
          allergies: data.allergies === null ? Prisma.JsonNull : data.allergies as Prisma.InputJsonValue,
        }),
        ...(data.medicalNotes !== undefined && {
          medicalNotes: data.medicalNotes === null ? Prisma.JsonNull : data.medicalNotes as Prisma.InputJsonValue,
        }),
      },
    });
    return toEntity(model);
  };
};
