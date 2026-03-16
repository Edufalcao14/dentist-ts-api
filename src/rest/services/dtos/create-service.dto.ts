import { z } from 'zod';

export const CreateServiceDtoSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
  durationMinutes: z.number().int().positive(),
  code: z.string().optional(),
});

export type CreateServiceDto = z.infer<typeof CreateServiceDtoSchema>;
