import { z } from 'zod';

export const AuthTokensDtoSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiredAt: z.string().datetime(),
});

export type AuthTokensDto = z.infer<typeof AuthTokensDtoSchema>;
