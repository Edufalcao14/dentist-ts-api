export interface UpdatePatientInput {
  id: bigint;
  cpf?: string | null | undefined;
  birthdate?: Date | null | undefined;
  allergies?: unknown | null | undefined;
  medicalNotes?: unknown | null | undefined;
}
