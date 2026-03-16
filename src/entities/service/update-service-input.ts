export interface UpdateServiceInput {
  id: bigint;
  name?: string | undefined;
  code?: string | null | undefined;
  price?: number | undefined;
  durationMinutes?: number | undefined;
}
