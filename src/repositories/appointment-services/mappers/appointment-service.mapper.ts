import type { AppointmentService } from '@/entities/appointment-service/appointment-service.js';
import type { AppointmentService as AppointmentServiceModel } from '@prisma/client';

export const toEntity = (model: AppointmentServiceModel): AppointmentService => {
  return {
    id: model.id,
    appointmentId: model.appointmentId,
    serviceId: model.serviceId,
    quantity: model.quantity,
    notes: model.notes,
    unitPrice: model.unitPrice,
    lineTotal: model.lineTotal,
    createdAt: model.createdAt,
  };
};
