import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { AppointmentServiceDto } from '../dtos/appointment-service.dto.js';
import type { UpdateAppointmentServiceDto } from '../dtos/update-appointment-service.dto.js';
import { toDto } from '../mappers/appointment-service.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initUpdateAppointmentServiceController = (usecases: Usecases) => {
  return async (
    req: Request<{ appointmentId: string; id: string }, AppointmentServiceDto, UpdateAppointmentServiceDto> & { context: Context },
    res: Response<AppointmentServiceDto | { message: string }>,
  ) => {
    try {
      const item = await usecases.appointmentService.update(req.context, {
        id: BigInt(req.params.id),
        ...req.body,
      });
      res.json(toDto(item));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};
