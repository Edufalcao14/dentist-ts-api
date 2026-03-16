export interface User {
  id: bigint;
  tenantId: bigint;
  firebaseUid: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string;
  birthdate: Date | null;
  cpf: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
