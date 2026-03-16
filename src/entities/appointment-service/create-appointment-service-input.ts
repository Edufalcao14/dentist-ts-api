export interface CreateAppointmentServiceInput {
  appointmentId: bigint;
  serviceId: bigint;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  notes?: string | undefined;
}
