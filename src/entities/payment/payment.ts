import type { Decimal } from '@prisma/client/runtime/library.js';

export interface Payment {
  id: bigint;
  appointmentId: bigint;
  amount: Decimal;
  stripePaymentIntentId: string | null;
  status: string;
  paymentMethod: string | null;
  createdAt: Date;
}
