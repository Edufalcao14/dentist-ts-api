import { z } from 'zod';

export const CreateAppointmentServiceDtoSchema = z.object({
  appointmentId: z.string(),
  serviceId: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  lineTotal: z.number().positive(),
  notes: z.string().optional(),
});

export type CreateAppointmentServiceDto = z.infer<typeof CreateAppointmentServiceDtoSchema>;
