import { z } from 'zod';

export const TenantDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string().nullable(),
  cnpj: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  stripeCustomerId: z.string().nullable(),
  planType: z.string(),
  planStatus: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});

export type TenantDto = z.infer<typeof TenantDtoSchema>;
