export interface CreateTenantInput {
  name: string;
  planType: string;
  planStatus: string;
  address?: string | undefined;
  cnpj?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
  stripeCustomerId?: string | undefined;
}
