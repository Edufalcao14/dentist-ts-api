import { z } from 'zod';

export const CreatePatientDtoSchema = z.object({
  userId: z.string(),
  cpf: z.string().optional(),
  birthdate: z.string().optional(),
  allergies: z.unknown().optional(),
  medicalNotes: z.unknown().optional(),
});

export type CreatePatientDto = z.infer<typeof CreatePatientDtoSchema>;
