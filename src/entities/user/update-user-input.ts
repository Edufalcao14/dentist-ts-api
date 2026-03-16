export interface UpdateUserInput {
  id: bigint;
  role?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
  phone?: string | null | undefined;
  birthdate?: Date | null | undefined;
  cpf?: string | null | undefined;
}
