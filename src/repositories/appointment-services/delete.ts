import type { PrismaClient } from '@prisma/client';

export const initDeleteAppointmentServiceRepository = (prisma: PrismaClient) => {
  return async (id: bigint): Promise<void> => {
    await prisma.appointmentService.delete({ where: { id } });
  };
};
