import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { AppointmentServiceDto } from '../dtos/appointment-service.dto.js';
import type { CreateAppointmentServiceDto } from '../dtos/create-appointment-service.dto.js';
import { toDto } from '../mappers/appointment-service.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initCreateAppointmentServiceController = (usecases: Usecases) => {
  return async (
    req: Request<{ appointmentId: string }, AppointmentServiceDto, CreateAppointmentServiceDto> & { context: Context },
    res: Response<AppointmentServiceDto | { message: string }>,
  ) => {
    try {
      const item = await usecases.appointmentService.create(req.context, {
        appointmentId: BigInt(req.body.appointmentId),
        serviceId: BigInt(req.body.serviceId),
        quantity: req.body.quantity,
        unitPrice: req.body.unitPrice,
        lineTotal: req.body.lineTotal,
        notes: req.body.notes,
      });
      res.status(201).json(toDto(item));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};
