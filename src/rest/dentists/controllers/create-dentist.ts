import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { DentistDto } from '../dtos/dentist.dto.js';
import type { CreateDentistDto } from '../dtos/create-dentist.dto.js';
import { toDto } from '../mappers/dentist.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initCreateDentistController = (usecases: Usecases) => {
  return async (
    req: Request<Record<string, string>, DentistDto, CreateDentistDto> & { context: Context },
    res: Response<DentistDto | { message: string }>,
  ) => {
    try {
      const dentist = await usecases.dentist.create(req.context, {
        userId: BigInt(req.body.userId),
        croNumber: req.body.croNumber,
        specialization: req.body.specialization,
      });
      res.status(201).json(toDto(dentist));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};
