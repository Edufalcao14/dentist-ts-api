import { z } from 'zod';

export const CreatePaymentDtoSchema = z.object({
  appointmentId: z.string(),
  amount: z.number().positive(),
  status: z.string(),
  stripePaymentIntentId: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export type CreatePaymentDto = z.infer<typeof CreatePaymentDtoSchema>;
