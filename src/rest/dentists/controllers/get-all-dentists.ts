import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { DentistDto } from '../dtos/dentist.dto.js';
import { toDto } from '../mappers/dentist.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initGetAllDentistsController = (usecases: Usecases) => {
  return async (
    req: Request & { context: Context },
    res: Response<DentistDto[] | { message: string }>,
  ) => {
    try {
      const dentists = await usecases.dentist.getAll(req.context);
      res.json(dentists.map(toDto));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};
