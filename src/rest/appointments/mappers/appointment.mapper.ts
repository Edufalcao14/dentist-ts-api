import type { Appointment } from '@/entities/appointment/appointment.js';
import type { AppointmentDto } from '../dtos/appointment.dto.js';

export const toDto = (entity: Appointment): AppointmentDto => {
  return {
    id: entity.id.toString(),
    tenantId: entity.tenantId.toString(),
    patientId: entity.patientId.toString(),
    dentistId: entity.dentistId.toString(),
    dateTime: entity.dateTime.toISOString(),
    status: entity.status,
    notes: entity.notes,
    totalAmount: entity.totalAmount ? entity.totalAmount.toString() : null,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
    deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : null,
  };
};
