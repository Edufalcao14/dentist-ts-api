import type { PrismaClient } from '@prisma/client';
import type { Dentist } from '@/entities/dentist/dentist.js';
import type { CreateDentistInput } from '@/entities/dentist/create-dentist-input.js';
import { toEntity } from './mappers/dentist.mapper.js';

export const initCreateDentistRepository = (prisma: PrismaClient) => {
  return async (data: CreateDentistInput): Promise<Dentist> => {
    const model = await prisma.dentist.create({
      data: {
        userId: data.userId,
        croNumber: data.croNumber ?? null,
        specialization: data.specialization ?? null,
      },
    });
    return toEntity(model);
  };
};
