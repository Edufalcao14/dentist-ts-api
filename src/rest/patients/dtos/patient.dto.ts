import { z } from 'zod';

export const PatientDtoSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  userId: z.string(),
  cpf: z.string().nullable(),
  birthdate: z.string().nullable(),
  allergies: z.unknown().nullable(),
  medicalNotes: z.unknown().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});

export type PatientDto = z.infer<typeof PatientDtoSchema>;
