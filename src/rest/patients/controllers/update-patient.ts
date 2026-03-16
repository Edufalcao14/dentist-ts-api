import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { PatientDto } from '../dtos/patient.dto.js';
import type { UpdatePatientDto } from '../dtos/update-patient.dto.js';
import { toDto } from '../mappers/patient.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initUpdatePatientController = (usecases: Usecases) => {
  return async (
    req: Request<{ id: string }, PatientDto, UpdatePatientDto> & { context: Context },
    res: Response<PatientDto | { message: string }>,
  ) => {
    try {
      const patient = await usecases.patient.update(req.context, {
        id: BigInt(req.params.id),
        cpf: req.body.cpf ?? undefined,
        birthdate: req.body.birthdate ? new Date(req.body.birthdate) : undefined,
        allergies: req.body.allergies,
        medicalNotes: req.body.medicalNotes,
      });
      res.json(toDto(patient));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};
