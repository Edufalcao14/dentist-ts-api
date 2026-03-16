export interface UpdatePaymentInput {
  id: bigint;
  status?: string | undefined;
  stripePaymentIntentId?: string | null | undefined;
  paymentMethod?: string | null | undefined;
}
