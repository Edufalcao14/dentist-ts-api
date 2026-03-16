import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initDeleteAppointmentController = (usecases: Usecases) => {
  return async (req: Request<{ id: string }> & { context: Context }, res: Response<void | { message: string }>) => {
    try {
      await usecases.appointment.delete(req.context, BigInt(req.params.id));
      res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};
