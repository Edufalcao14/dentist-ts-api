import { z } from 'zod';

export const AppointmentServiceDtoSchema = z.object({
  id: z.string(),
  appointmentId: z.string(),
  serviceId: z.string(),
  quantity: z.number(),
  notes: z.string().nullable(),
  unitPrice: z.string(),
  lineTotal: z.string(),
  createdAt: z.string().datetime(),
});

export type AppointmentServiceDto = z.infer<typeof AppointmentServiceDtoSchema>;
