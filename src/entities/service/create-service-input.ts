export interface CreateServiceInput {
  tenantId: bigint;
  name: string;
  price: number;
  durationMinutes: number;
  code?: string | undefined;
}
