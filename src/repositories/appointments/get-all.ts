import type { PrismaClient } from '@prisma/client';
import type { Appointment } from '@/entities/appointment/appointment.js';
import { toEntity } from './mappers/appointment.mapper.js';

export const initGetAllAppointmentsRepository = (prisma: PrismaClient) => {
  return async (tenantId: bigint): Promise<Appointment[]> => {
    const models = await prisma.appointment.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { dateTime: 'desc' },
    });
    return models.map(toEntity);
  };
};
