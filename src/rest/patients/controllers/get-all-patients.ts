import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { PatientDto } from '../dtos/patient.dto.js';
import { toDto } from '../mappers/patient.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initGetAllPatientsController = (usecases: Usecases) => {
  return async (
    req: Request & { context: Context },
    res: Response<PatientDto[] | { message: string }>,
  ) => {
    try {
      const patients = await usecases.patient.getAll(req.context);
      res.json(patients.map(toDto));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};
