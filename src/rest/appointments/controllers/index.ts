import type { Usecases } from '@/usecases/index.js';
import { initGetAllAppointmentsController } from './get-all-appointments.js';
import { initGetAppointmentByIdController } from './get-appointment-by-id.js';
import { initCreateAppointmentController } from './create-appointment.js';
import { initUpdateAppointmentController } from './update-appointment.js';
import { initDeleteAppointmentController } from './delete-appointment.js';

export const initAppointmentControllers = (usecases: Usecases) => {
  return {
    getAll: initGetAllAppointmentsController(usecases),
    getById: initGetAppointmentByIdController(usecases),
    create: initCreateAppointmentController(usecases),
    update: initUpdateAppointmentController(usecases),
    delete: initDeleteAppointmentController(usecases),
  };
};

export type AppointmentControllers = ReturnType<typeof initAppointmentControllers>;
