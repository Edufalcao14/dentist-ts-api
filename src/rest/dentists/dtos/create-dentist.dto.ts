import { z } from 'zod';

export const CreateDentistDtoSchema = z.object({
  userId: z.string(),
  croNumber: z.string().optional(),
  specialization: z.string().optional(),
});

export type CreateDentistDto = z.infer<typeof CreateDentistDtoSchema>;
