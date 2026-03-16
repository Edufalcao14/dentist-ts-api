import { z } from 'zod';

export const UpdateTenantDtoSchema = z.object({
  name: z.string().optional(),
  planType: z.string().optional(),
  planStatus: z.string().optional(),
  address: z.string().nullable().optional(),
  cnpj: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  stripeCustomerId: z.string().nullable().optional(),
});

export type UpdateTenantDto = z.infer<typeof UpdateTenantDtoSchema>;
