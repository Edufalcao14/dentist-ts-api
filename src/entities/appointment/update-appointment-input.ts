export interface UpdateAppointmentInput {
  id: bigint;
  patientId?: bigint | undefined;
  dentistId?: bigint | undefined;
  dateTime?: Date | undefined;
  status?: string | undefined;
  notes?: string | null | undefined;
  totalAmount?: number | null | undefined;
}
