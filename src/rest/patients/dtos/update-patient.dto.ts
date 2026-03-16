import { z } from 'zod';

export const UpdatePatientDtoSchema = z.object({
  cpf: z.string().nullable().optional(),
  birthdate: z.string().nullable().optional(),
  allergies: z.unknown().nullable().optional(),
  medicalNotes: z.unknown().nullable().optional(),
});

export type UpdatePatientDto = z.infer<typeof UpdatePatientDtoSchema>;
