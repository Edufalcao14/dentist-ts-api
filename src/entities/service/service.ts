import type { Decimal } from '@prisma/client/runtime/library.js';

export interface Service {
  id: bigint;
  tenantId: bigint;
  name: string;
  code: string | null;
  price: Decimal;
  durationMinutes: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
