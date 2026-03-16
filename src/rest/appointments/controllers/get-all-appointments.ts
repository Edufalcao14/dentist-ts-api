import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { AppointmentDto } from '../dtos/appointment.dto.js';
import { toDto } from '../mappers/appointment.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initGetAllAppointmentsController = (usecases: Usecases) => {
  return async (req: Request & { context: Context }, res: Response<AppointmentDto[] | { message: string }>) => {
    try {
      const items = await usecases.appointment.getAll(req.context);
      res.json(items.map(toDto));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};
