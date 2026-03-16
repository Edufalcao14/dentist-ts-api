export interface CreateAppointmentInput {
  tenantId: bigint;
  patientId: bigint;
  dentistId: bigint;
  dateTime: Date;
  status: string;
  notes?: string | undefined;
  totalAmount?: number | undefined;
}
