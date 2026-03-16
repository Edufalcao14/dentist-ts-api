export interface CreatePatientInput {
  tenantId: bigint;
  userId: bigint;
  cpf?: string | undefined;
  birthdate?: Date | undefined;
  allergies?: unknown | undefined;
  medicalNotes?: unknown | undefined;
}
