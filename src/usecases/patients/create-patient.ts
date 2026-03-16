import Joi from 'joi';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { Patient } from '@/entities/patient/patient.js';
import type { CreatePatientInput } from '@/entities/patient/create-patient-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';
import { BadRequestError } from '@/entities/errors/bad-request-error.js';

export const createPatient = async (context: Context, input: CreatePatientInput): Promise<Patient> => {
  validateInput(input);

  if (!context.auth.isAuthenticated || !context.auth.tenantResolved) {
    throw new UnauthorizedError('Authentication required');
  }

  const user = await context.repositories.users.getById(input.userId, context.auth.tenantId);
  if (!user) throw new NotFoundError('User not found in this tenant');

  const existing = await context.repositories.patients.getAll(context.auth.tenantId);
  const alreadyPatient = existing.find((p) => p.userId === input.userId);
  if (alreadyPatient) throw new BadRequestError('This user already has a patient profile');

  return context.repositories.patients.create({ ...input, tenantId: context.auth.tenantId });
};

function validateInput(input: CreatePatientInput) {
  const schema = Joi.object<CreatePatientInput>({
    tenantId: Joi.optional(),
    userId: Joi.required(),
    cpf: Joi.string().optional().allow(null),
    birthdate: Joi.date().optional().allow(null),
    allergies: Joi.any().optional().allow(null),
    medicalNotes: Joi.any().optional().allow(null),
  });
  const { error } = schema.validate(input);
  if (error) throw new BadUserInputError(error.message);
}
