export interface Patient {
  id: bigint;
  tenantId: bigint;
  userId: bigint;
  cpf: string | null;
  birthdate: Date | null;
  allergies: unknown | null;
  medicalNotes: unknown | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
