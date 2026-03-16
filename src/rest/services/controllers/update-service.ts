import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { ServiceDto } from '../dtos/service.dto.js';
import type { UpdateServiceDto } from '../dtos/update-service.dto.js';
import { toDto } from '../mappers/service.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initUpdateServiceController = (usecases: Usecases) => {
  return async (
    req: Request<{ id: string }, ServiceDto, UpdateServiceDto> & { context: Context },
    res: Response<ServiceDto | { message: string }>,
  ) => {
    try {
      const item = await usecases.service.update(req.context, { id: BigInt(req.params.id), ...req.body });
      res.json(toDto(item));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};
