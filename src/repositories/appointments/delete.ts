import type { PrismaClient } from '@prisma/client';

export const initDeleteAppointmentRepository = (prisma: PrismaClient) => {
  return async (id: bigint): Promise<void> => {
    await prisma.appointment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  };
};
