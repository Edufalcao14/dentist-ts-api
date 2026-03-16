export interface CreatePaymentInput {
  appointmentId: bigint;
  amount: number;
  status: string;
  stripePaymentIntentId?: string | undefined;
  paymentMethod?: string | undefined;
}
