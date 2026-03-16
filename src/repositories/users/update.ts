import type { PrismaClient } from '@prisma/client';
import type { User } from '@/entities/user/user.js';
import type { UpdateUserInput } from '@/entities/user/update-user-input.js';
import { toEntity } from './mappers/user.mapper.js';

export const initUpdateUserRepository = (prisma: PrismaClient) => {
  return async (data: UpdateUserInput): Promise<User> => {
    const model = await prisma.user.update({
      where: { id: data.id },
      data: {
        ...(data.role !== undefined && { role: data.role }),
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.birthdate !== undefined && { birthdate: data.birthdate }),
        ...(data.cpf !== undefined && { cpf: data.cpf }),
      },
    });
    return toEntity(model);
  };
};
