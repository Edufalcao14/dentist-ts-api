import { z } from 'zod';

export const SignInDtoSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type SignInDto = z.infer<typeof SignInDtoSchema>;
