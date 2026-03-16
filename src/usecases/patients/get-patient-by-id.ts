import type { AppContext as Context } from '@/libs/context/index.js';
import type { Patient } from '@/entities/patient/patient.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const getPatientById = async (context: Context, id: bigint): Promise<Patient> => {
  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const patient = await context.repositories.patients.getById(id, context.auth.tenantId);
  if (!patient) throw new NotFoundError('Patient not found');

  return patient;
};
