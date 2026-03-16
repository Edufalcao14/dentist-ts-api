import { z } from 'zod';

export const UpdateAppointmentServiceDtoSchema = z.object({
  quantity: z.number().int().positive().optional(),
  unitPrice: z.number().positive().optional(),
  lineTotal: z.number().positive().optional(),
  notes: z.string().nullable().optional(),
});

export type UpdateAppointmentServiceDto = z.infer<typeof UpdateAppointmentServiceDtoSchema>;
