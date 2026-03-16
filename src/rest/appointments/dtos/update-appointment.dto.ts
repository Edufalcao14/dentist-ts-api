import { z } from 'zod';

export const UpdateAppointmentDtoSchema = z.object({
  patientId: z.string().optional(),
  dentistId: z.string().optional(),
  dateTime: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().nullable().optional(),
  totalAmount: z.number().positive().nullable().optional(),
});

export type UpdateAppointmentDto = z.infer<typeof UpdateAppointmentDtoSchema>;
