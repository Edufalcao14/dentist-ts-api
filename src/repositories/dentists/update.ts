import type { PrismaClient } from '@prisma/client';
import type { Dentist } from '@/entities/dentist/dentist.js';
import type { UpdateDentistInput } from '@/entities/dentist/update-dentist-input.js';
import { toEntity } from './mappers/dentist.mapper.js';

export const initUpdateDentistRepository = (prisma: PrismaClient) => {
  return async (data: UpdateDentistInput): Promise<Dentist> => {
    const model = await prisma.dentist.update({
      where: { id: data.id },
      data: {
        ...(data.croNumber !== undefined && { croNumber: data.croNumber }),
        ...(data.specialization !== undefined && { specialization: data.specialization }),
      },
    });
    return toEntity(model);
  };
};
