export interface Tenant {
  id: bigint;
  name: string;
  address: string | null;
  cnpj: string | null;
  email: string | null;
  phone: string | null;
  stripeCustomerId: string | null;
  planType: string;
  planStatus: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
