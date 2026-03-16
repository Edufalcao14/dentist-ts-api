import { z } from 'zod';
import { UserDtoSchema } from '../../users/dtos/user.dto.js';

export const AuthPayloadDtoSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserDtoSchema,
});

export type AuthPayloadDto = z.infer<typeof AuthPayloadDtoSchema>;
