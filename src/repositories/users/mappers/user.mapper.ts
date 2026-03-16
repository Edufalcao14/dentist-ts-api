import type { User } from '@/entities/user/user.js';
import type { User as UserModel } from '@prisma/client';

export const toEntity = (model: UserModel): User => {
  return {
    id: model.id,
    tenantId: model.tenantId,
    firebaseUid: model.firebaseUid,
    role: model.role,
    firstName: model.firstName,
    lastName: model.lastName,
    phone: model.phone,
    email: model.email,
    birthdate: model.birthdate,
    cpf: model.cpf,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
    deletedAt: model.deletedAt,
  };
};
