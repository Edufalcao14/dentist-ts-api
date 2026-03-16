import { z } from 'zod';

export const UpdateDentistDtoSchema = z.object({
  croNumber: z.string().nullable().optional(),
  specialization: z.string().nullable().optional(),
});

export type UpdateDentistDto = z.infer<typeof UpdateDentistDtoSchema>;
