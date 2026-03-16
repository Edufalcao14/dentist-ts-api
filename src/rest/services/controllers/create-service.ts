import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { ServiceDto } from '../dtos/service.dto.js';
import type { CreateServiceDto } from '../dtos/create-service.dto.js';
import { toDto } from '../mappers/service.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initCreateServiceController = (usecases: Usecases) => {
  return async (
    req: Request<Record<string, string>, ServiceDto, CreateServiceDto> & { context: Context },
    res: Response<ServiceDto | { message: string }>,
  ) => {
    try {
      const item = await usecases.service.create(req.context, {
        tenantId: BigInt(0),
        name: req.body.name,
        price: req.body.price,
        durationMinutes: req.body.durationMinutes,
        code: req.body.code,
      });
      res.status(201).json(toDto(item));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};
