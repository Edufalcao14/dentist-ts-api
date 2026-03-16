import type { AppContext as Context } from '@/libs/context/index.js';
import type { Patient } from '@/entities/patient/patient.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';

export const getAllPatients = async (context: Context): Promise<Patient[]> => {
  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  return context.repositories.patients.getAll(context.auth.tenantId);
};
