import type { PrismaClient } from '@prisma/client';
import type { Appointment } from '@/entities/appointment/appointment.js';
import type { UpdateAppointmentInput } from '@/entities/appointment/update-appointment-input.js';
import { toEntity } from './mappers/appointment.mapper.js';

export const initUpdateAppointmentRepository = (prisma: PrismaClient) => {
  return async (data: UpdateAppointmentInput): Promise<Appointment> => {
    const model = await prisma.appointment.update({
      where: { id: data.id },
      data: {
        ...(data.patientId !== undefined && { patientId: data.patientId }),
        ...(data.dentistId !== undefined && { dentistId: data.dentistId }),
        ...(data.dateTime !== undefined && { dateTime: data.dateTime }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.totalAmount !== undefined && { totalAmount: data.totalAmount }),
      },
    });
    return toEntity(model);
  };
};
