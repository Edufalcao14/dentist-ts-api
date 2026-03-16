import type { Decimal } from '@prisma/client/runtime/library.js';

export interface AppointmentService {
  id: bigint;
  appointmentId: bigint;
  serviceId: bigint;
  quantity: number;
  notes: string | null;
  unitPrice: Decimal;
  lineTotal: Decimal;
  createdAt: Date;
}
