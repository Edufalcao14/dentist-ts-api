import type { PrismaClient } from '@prisma/client';
import type { Appointment } from '@/entities/appointment/appointment.js';
import { toEntity } from './mappers/appointment.mapper.js';

export const initGetAppointmentByIdRepository = (prisma: PrismaClient) => {
  return async (id: bigint, tenantId: bigint): Promise<Appointment | null> => {
    const model = await prisma.appointment.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    return model ? toEntity(model) : null;
  };
};
