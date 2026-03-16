import { z } from 'zod';

export const ErrorDtoSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
});

export type ErrorDto = z.infer<typeof ErrorDtoSchema>;
