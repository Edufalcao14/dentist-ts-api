import type { PrismaClient } from '@prisma/client';
import type { AppointmentService } from '@/entities/appointment-service/appointment-service.js';
import type { UpdateAppointmentServiceInput } from '@/entities/appointment-service/update-appointment-service-input.js';
import { toEntity } from './mappers/appointment-service.mapper.js';

export const initUpdateAppointmentServiceRepository = (prisma: PrismaClient) => {
  return async (data: UpdateAppointmentServiceInput): Promise<AppointmentService> => {
    const model = await prisma.appointmentService.update({
      where: { id: data.id },
      data: {
        ...(data.quantity !== undefined && { quantity: data.quantity }),
        ...(data.unitPrice !== undefined && { unitPrice: data.unitPrice }),
        ...(data.lineTotal !== undefined && { lineTotal: data.lineTotal }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });
    return toEntity(model);
  };
};
