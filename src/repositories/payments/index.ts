import type { PrismaClient } from '@prisma/client';
import { initCreatePaymentRepository } from './create.js';
import { initGetAllPaymentsRepository } from './get-all.js';
import { initGetPaymentByIdRepository } from './get-by-id.js';
import { initUpdatePaymentRepository } from './update.js';
import { initDeletePaymentRepository } from './delete.js';

export const initPaymentRepositories = (prisma: PrismaClient) => {
  return {
    create: initCreatePaymentRepository(prisma),
    getAll: initGetAllPaymentsRepository(prisma),
    getById: initGetPaymentByIdRepository(prisma),
    update: initUpdatePaymentRepository(prisma),
    delete: initDeletePaymentRepository(prisma),
  };
};

export type PaymentRepositories = ReturnType<typeof initPaymentRepositories>;
