import { z } from 'zod';

export const AppointmentDtoSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  patientId: z.string(),
  dentistId: z.string(),
  dateTime: z.string().datetime(),
  status: z.string(),
  notes: z.string().nullable(),
  totalAmount: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});

export type AppointmentDto = z.infer<typeof AppointmentDtoSchema>;
