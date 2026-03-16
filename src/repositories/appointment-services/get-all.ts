import type { PrismaClient } from '@prisma/client';
import type { AppointmentService } from '@/entities/appointment-service/appointment-service.js';
import { toEntity } from './mappers/appointment-service.mapper.js';

export const initGetAllAppointmentServicesRepository = (prisma: PrismaClient) => {
  return async (appointmentId: bigint, tenantId: bigint): Promise<AppointmentService[]> => {
    const models = await prisma.appointmentService.findMany({
      where: {
        appointmentId,
        appointment: { tenantId, deletedAt: null },
      },
      orderBy: { createdAt: 'asc' },
    });
    return models.map(toEntity);
  };
};
