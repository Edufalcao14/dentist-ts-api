import { z } from 'zod';

export const CreateUserDtoSchema = z.object({
  role: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  birthdate: z.string().optional(),
  cpf: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
