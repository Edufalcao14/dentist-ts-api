import { z } from 'zod';

export const UpdateServiceDtoSchema = z.object({
  name: z.string().optional(),
  code: z.string().nullable().optional(),
  price: z.number().positive().optional(),
  durationMinutes: z.number().int().positive().optional(),
});

export type UpdateServiceDto = z.infer<typeof UpdateServiceDtoSchema>;
