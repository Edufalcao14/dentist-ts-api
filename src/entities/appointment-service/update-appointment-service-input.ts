export interface UpdateAppointmentServiceInput {
  id: bigint;
  quantity?: number | undefined;
  unitPrice?: number | undefined;
  lineTotal?: number | undefined;
  notes?: string | null | undefined;
}
