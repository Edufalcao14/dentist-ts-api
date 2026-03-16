import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { PaymentDto } from '../dtos/payment.dto.js';
import type { UpdatePaymentDto } from '../dtos/update-payment.dto.js';
import { toDto } from '../mappers/payment.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initUpdatePaymentController = (usecases: Usecases) => {
  return async (
    req: Request<{ appointmentId: string; id: string }, PaymentDto, UpdatePaymentDto> & { context: Context },
    res: Response<PaymentDto | { message: string }>,
  ) => {
    try {
      const item = await usecases.payment.update(req.context, { id: BigInt(req.params.id), ...req.body });
      res.json(toDto(item));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};
