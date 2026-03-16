import { z } from 'zod';

export const UpdateUserDtoSchema = z.object({
  role: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().nullable().optional(),
  birthdate: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
