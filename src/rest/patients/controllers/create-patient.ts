import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { PatientDto } from '../dtos/patient.dto.js';
import type { CreatePatientDto } from '../dtos/create-patient.dto.js';
import { toDto } from '../mappers/patient.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initCreatePatientController = (usecases: Usecases) => {
  return async (
    req: Request<Record<string, string>, PatientDto, CreatePatientDto> & { context: Context },
    res: Response<PatientDto | { message: string }>,
  ) => {
    try {
      const patient = await usecases.patient.create(req.context, {
        tenantId: BigInt(0),
        userId: BigInt(req.body.userId),
        cpf: req.body.cpf,
        birthdate: req.body.birthdate ? new Date(req.body.birthdate) : undefined,
        allergies: req.body.allergies,
        medicalNotes: req.body.medicalNotes,
      });
      res.status(201).json(toDto(patient));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};
