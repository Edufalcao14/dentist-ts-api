import type { AuthPayload } from '@/entities/user/auth-payload.js';
import type { AuthPayloadDto } from '../dtos/auth-payload.dto.js';
import type { AuthTokensEntity } from '@/entities/auth/auth-tokens.js';
import type { AuthTokensDto } from '../dtos/auth-tokens.dto.js';
import { toDto as userToDto } from '../../users/mappers/user.mapper.js';

export const toDto = (entity: AuthPayload): AuthPayloadDto => {
  return {
    accessToken: entity.accessToken,
    refreshToken: entity.refreshToken,
    user: userToDto(entity.user),
  };
};

export const authTokensToDto = (entity: AuthTokensEntity): AuthTokensDto => {
  return {
    accessToken: entity.accessToken,
    refreshToken: entity.refreshToken ?? '',
    expiredAt: entity.expiredAt.toISOString(),
  };
};
