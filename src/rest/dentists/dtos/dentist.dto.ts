import { z } from 'zod';

export const DentistDtoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  croNumber: z.string().nullable(),
  specialization: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export type DentistDto = z.infer<typeof DentistDtoSchema>;
