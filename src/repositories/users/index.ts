import type { PrismaClient } from '@prisma/client';
import { initGetAllUsersRepository } from './get-all.js';
import { initCreateUserRepository } from './create.js';
import { initGetUserByIdRepository } from './get-by-id.js';
import { initGetUserByEmailRepository } from './get-by-email.js';
import { initGetUserByFirebaseUidRepository } from './get-by-firebase-uid.js';
import { initUpdateUserRepository } from './update.js';
import { initDeleteUserRepository } from './delete.js';

export const initUserRepositories = (prisma: PrismaClient) => {
  return {
    getAll: initGetAllUsersRepository(prisma),
    getById: initGetUserByIdRepository(prisma),
    create: initCreateUserRepository(prisma),
    getByEmail: initGetUserByEmailRepository(prisma),
    getByFirebaseUid: initGetUserByFirebaseUidRepository(prisma),
    update: initUpdateUserRepository(prisma),
    delete: initDeleteUserRepository(prisma),
  };
};

export type UserRepositories = ReturnType<typeof initUserRepositories>;
