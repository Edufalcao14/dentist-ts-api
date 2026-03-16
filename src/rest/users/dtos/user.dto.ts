import { z } from 'zod';

export const UserDtoSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  firebaseUid: z.string(),
  role: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  birthdate: z.string().nullable(),
  cpf: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});

export type UserDto = z.infer<typeof UserDtoSchema>;
