import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { AppointmentDto } from '../dtos/appointment.dto.js';
import type { CreateAppointmentDto } from '../dtos/create-appointment.dto.js';
import { toDto } from '../mappers/appointment.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initCreateAppointmentController = (usecases: Usecases) => {
  return async (
    req: Request<Record<string, string>, AppointmentDto, CreateAppointmentDto> & { context: Context },
    res: Response<AppointmentDto | { message: string }>,
  ) => {
    try {
      const item = await usecases.appointment.create(req.context, {
        tenantId: BigInt(0),
        patientId: BigInt(req.body.patientId),
        dentistId: BigInt(req.body.dentistId),
        dateTime: new Date(req.body.dateTime),
        status: req.body.status,
        notes: req.body.notes,
        totalAmount: req.body.totalAmount,
      });
      res.status(201).json(toDto(item));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};
