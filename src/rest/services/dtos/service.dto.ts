import { z } from 'zod';

export const ServiceDtoSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  code: z.string().nullable(),
  price: z.string(),
  durationMinutes: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});

export type ServiceDto = z.infer<typeof ServiceDtoSchema>;
