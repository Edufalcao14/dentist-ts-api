import type { PrismaClient } from '@prisma/client';
import type { Patient } from '@/entities/patient/patient.js';
import { toEntity } from './mappers/patient.mapper.js';

export const initGetAllPatientsRepository = (prisma: PrismaClient) => {
  return async (tenantId: bigint): Promise<Patient[]> => {
    const models = await prisma.patient.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return models.map(toEntity);
  };
};
