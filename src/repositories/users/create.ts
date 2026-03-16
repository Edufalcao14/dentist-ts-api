import type { PrismaClient } from '@prisma/client';
import type { User } from '@/entities/user/user.js';
import type { CreateUserInput } from '@/entities/user/create-user-input.js';
import { toEntity } from './mappers/user.mapper.js';

export const initCreateUserRepository = (prisma: PrismaClient) => {
  return async (data: CreateUserInput): Promise<User> => {
    const model = await prisma.user.create({
      data: {
        tenantId: data.tenantId,
        firebaseUid: data.firebaseUid,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone ?? null,
        birthdate: data.birthdate ?? null,
        cpf: data.cpf ?? null,
      },
    });
    return toEntity(model);
  };
};
