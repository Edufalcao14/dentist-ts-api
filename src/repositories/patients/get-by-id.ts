import type { PrismaClient } from '@prisma/client';
import type { Patient } from '@/entities/patient/patient.js';
import { toEntity } from './mappers/patient.mapper.js';

export const initGetPatientByIdRepository = (prisma: PrismaClient) => {
  return async (id: bigint, tenantId: bigint): Promise<Patient | null> => {
    const model = await prisma.patient.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    return model ? toEntity(model) : null;
  };
};
