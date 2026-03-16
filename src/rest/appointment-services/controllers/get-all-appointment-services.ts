import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { AppointmentServiceDto } from '../dtos/appointment-service.dto.js';
import { toDto } from '../mappers/appointment-service.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initGetAllAppointmentServicesController = (usecases: Usecases) => {
  return async (
    req: Request<{ appointmentId: string }> & { context: Context },
    res: Response<AppointmentServiceDto[] | { message: string }>,
  ) => {
    try {
      const items = await usecases.appointmentService.getAll(req.context, BigInt(req.params.appointmentId));
      res.json(items.map(toDto));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};
