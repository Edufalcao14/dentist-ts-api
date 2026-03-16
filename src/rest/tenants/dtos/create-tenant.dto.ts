import { z } from 'zod';

export const CreateTenantDtoSchema = z.object({
  name: z.string(),
  planType: z.string(),
  planStatus: z.string(),
  address: z.string().optional(),
  cnpj: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  stripeCustomerId: z.string().optional(),
});

export type CreateTenantDto = z.infer<typeof CreateTenantDtoSchema>;
