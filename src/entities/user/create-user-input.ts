export interface CreateUserInput {
  tenantId: bigint;
  firebaseUid: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | undefined;
  birthdate?: Date | undefined;
  cpf?: string | undefined;
}
