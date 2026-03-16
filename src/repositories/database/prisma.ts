import { PrismaClient, Prisma } from '@prisma/client';
import { config } from '@/libs/config/index.js';

declare global {
  var prisma: PrismaClient | undefined;
}

const log: Prisma.LogLevel[] = config.env === 'dev'
  ? ['query', 'error', 'warn']
  : ['error'];

export const prisma =
  globalThis.prisma ??
  new PrismaClient({ log });

if (config.env !== 'prod') {
  globalThis.prisma = prisma;
}

