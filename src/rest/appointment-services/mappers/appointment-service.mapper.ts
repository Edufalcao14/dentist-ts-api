import type { AppointmentService } from '@/entities/appointment-service/appointment-service.js';
import type { AppointmentServiceDto } from '../dtos/appointment-service.dto.js';

export const toDto = (entity: AppointmentService): AppointmentServiceDto => {
  return {
    id: entity.id.toString(),
    appointmentId: entity.appointmentId.toString(),
    serviceId: entity.serviceId.toString(),
    quantity: entity.quantity,
    notes: entity.notes,
    unitPrice: entity.unitPrice.toString(),
    lineTotal: entity.lineTotal.toString(),
    createdAt: entity.createdAt.toISOString(),
  };
};
