export interface Dentist {
  id: bigint;
  userId: bigint;
  croNumber: string | null;
  specialization: string | null;
  createdAt: Date;
}
