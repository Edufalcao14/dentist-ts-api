import { z } from 'zod';

export const UpdatePaymentDtoSchema = z.object({
  status: z.string().optional(),
  stripePaymentIntentId: z.string().nullable().optional(),
  paymentMethod: z.string().nullable().optional(),
});

export type UpdatePaymentDto = z.infer<typeof UpdatePaymentDtoSchema>;
