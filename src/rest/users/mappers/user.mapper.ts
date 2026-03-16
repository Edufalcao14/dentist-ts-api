import type { User } from '@/entities/user/user.js';
import type { UserDto } from '../dtos/user.dto.js';

export const toDto = (entity: User): UserDto => {
  return {
    id: entity.id.toString(),
    tenantId: entity.tenantId.toString(),
    firebaseUid: entity.firebaseUid,
    role: entity.role,
    firstName: entity.firstName,
    lastName: entity.lastName,
    email: entity.email,
    phone: entity.phone,
    birthdate: entity.birthdate ? entity.birthdate.toISOString() : null,
    cpf: entity.cpf,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
    deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : null,
  };
};
