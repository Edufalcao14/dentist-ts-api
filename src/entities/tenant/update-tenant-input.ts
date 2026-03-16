export interface UpdateTenantInput {
  id: bigint;
  name?: string | undefined;
  planType?: string | undefined;
  planStatus?: string | undefined;
  address?: string | null | undefined;
  cnpj?: string | null | undefined;
  email?: string | null | undefined;
  phone?: string | null | undefined;
  stripeCustomerId?: string | null | undefined;
}
