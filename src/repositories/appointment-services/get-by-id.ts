import type { PrismaClient } from '@prisma/client';
import type { AppointmentService } from '@/entities/appointment-service/appointment-service.js';
import { toEntity } from './mappers/appointment-service.mapper.js';

export const initGetAppointmentServiceByIdRepository = (prisma: PrismaClient) => {
  return async (id: bigint, tenantId: bigint): Promise<AppointmentService | null> => {
    const model = await prisma.appointmentService.findFirst({
      where: {
        id,
        appointment: { tenantId, deletedAt: null },
      },
    });
    return model ? toEntity(model) : null;
  };
};
