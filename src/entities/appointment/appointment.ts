import type { Decimal } from '@prisma/client/runtime/library.js';

export interface Appointment {
  id: bigint;
  tenantId: bigint;
  patientId: bigint;
  dentistId: bigint;
  dateTime: Date;
  status: string;
  notes: string | null;
  totalAmount: Decimal | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
