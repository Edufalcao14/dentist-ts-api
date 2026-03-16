import type { PrismaClient } from '@prisma/client';
import type { Appointment } from '@/entities/appointment/appointment.js';
import type { CreateAppointmentInput } from '@/entities/appointment/create-appointment-input.js';
import { toEntity } from './mappers/appointment.mapper.js';

export const initCreateAppointmentRepository = (prisma: PrismaClient) => {
  return async (data: CreateAppointmentInput): Promise<Appointment> => {
    const model = await prisma.appointment.create({
      data: {
        tenantId: data.tenantId,
        patientId: data.patientId,
        dentistId: data.dentistId,
        dateTime: data.dateTime,
        status: data.status,
        notes: data.notes ?? null,
        totalAmount: data.totalAmount ?? null,
      },
    });
    return toEntity(model);
  };
};
