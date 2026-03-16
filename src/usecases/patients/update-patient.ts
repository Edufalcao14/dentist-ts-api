import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { Patient } from '@/entities/patient/patient.js';
import type { UpdatePatientInput } from '@/entities/patient/update-patient-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export const updatePatient = async (context: Context, input: UpdatePatientInput): Promise<Patient> => {
  validateInput(input);

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const existing = await context.repositories.patients.getById(input.id, context.auth.tenantId);
  if (!existing) throw new NotFoundError('Patient not found');

  return context.repositories.patients.update(input);
};

function validateInput(input: UpdatePatientInput) {
  const schema = Joi.object<UpdatePatientInput>({
    id: Joi.required(),
    cpf: Joi.string().optional().allow(null),
    birthdate: Joi.date().optional().allow(null),
    allergies: Joi.any().optional().allow(null),
    medicalNotes: Joi.any().optional().allow(null),
  });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
