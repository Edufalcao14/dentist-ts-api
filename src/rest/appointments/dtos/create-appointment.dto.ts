import { z } from 'zod';

export const CreateAppointmentDtoSchema = z.object({
  patientId: z.string(),
  dentistId: z.string(),
  dateTime: z.string(),
  status: z.string(),
  notes: z.string().optional(),
  totalAmount: z.number().positive().optional(),
});

export type CreateAppointmentDto = z.infer<typeof CreateAppointmentDtoSchema>;
