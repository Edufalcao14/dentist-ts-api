import type { PrismaClient } from '@prisma/client';
import type { AppointmentService } from '@/entities/appointment-service/appointment-service.js';
import type { CreateAppointmentServiceInput } from '@/entities/appointment-service/create-appointment-service-input.js';
import { toEntity } from './mappers/appointment-service.mapper.js';

export const initCreateAppointmentServiceRepository = (prisma: PrismaClient) => {
  return async (data: CreateAppointmentServiceInput): Promise<AppointmentService> => {
    const model = await prisma.appointmentService.create({
      data: {
        appointmentId: data.appointmentId,
        serviceId: data.serviceId,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        lineTotal: data.lineTotal,
        notes: data.notes ?? null,
      },
    });
    return toEntity(model);
  };
};
