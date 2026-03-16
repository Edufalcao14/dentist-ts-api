import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { AppointmentServiceDto } from '../dtos/appointment-service.dto.js';
import { toDto } from '../mappers/appointment-service.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initGetAppointmentServiceByIdController = (usecases: Usecases) => {
  return async (
    req: Request<{ appointmentId: string; id: string }> & { context: Context },
    res: Response<AppointmentServiceDto | { message: string }>,
  ) => {
    try {
      const item = await usecases.appointmentService.getById(req.context, BigInt(req.params.id));
      res.json(toDto(item));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};
