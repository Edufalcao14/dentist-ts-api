import { z } from 'zod';

export const PaymentDtoSchema = z.object({
  id: z.string(),
  appointmentId: z.string(),
  amount: z.string(),
  stripePaymentIntentId: z.string().nullable(),
  status: z.string(),
  paymentMethod: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export type PaymentDto = z.infer<typeof PaymentDtoSchema>;
