import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { AppointmentDto } from '../dtos/appointment.dto.js';
import type { UpdateAppointmentDto } from '../dtos/update-appointment.dto.js';
import { toDto } from '../mappers/appointment.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initUpdateAppointmentController = (usecases: Usecases) => {
  return async (
    req: Request<{ id: string }, AppointmentDto, UpdateAppointmentDto> & { context: Context },
    res: Response<AppointmentDto | { message: string }>,
  ) => {
    try {
      const item = await usecases.appointment.update(req.context, {
        id: BigInt(req.params.id),
        patientId: req.body.patientId ? BigInt(req.body.patientId) : undefined,
        dentistId: req.body.dentistId ? BigInt(req.body.dentistId) : undefined,
        dateTime: req.body.dateTime ? new Date(req.body.dateTime) : undefined,
        status: req.body.status,
        notes: req.body.notes ?? undefined,
        totalAmount: req.body.totalAmount ?? undefined,
      });
      res.json(toDto(item));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};
