import type { Appointment } from '@/entities/appointment/appointment.js';
import type { Appointment as AppointmentModel } from '@prisma/client';

export const toEntity = (model: AppointmentModel): Appointment => {
  return {
    id: model.id,
    tenantId: model.tenantId,
    patientId: model.patientId,
    dentistId: model.dentistId,
    dateTime: model.dateTime,
    status: model.status,
    notes: model.notes,
    totalAmount: model.totalAmount,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
    deletedAt: model.deletedAt,
  };
};
