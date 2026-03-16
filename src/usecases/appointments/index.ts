import { createAppointment } from './create-appointment.js';
import { getAllAppointments } from './get-all-appointments.js';
import { getAppointmentById } from './get-appointment-by-id.js';
import { updateAppointment } from './update-appointment.js';
import { deleteAppointment } from './delete-appointment.js';

export const initAppointmentUsecases = () => {
  return {
    create: createAppointment,
    getAll: getAllAppointments,
    getById: getAppointmentById,
    update: updateAppointment,
    delete: deleteAppointment,
  };
};

export type AppointmentUsecases = ReturnType<typeof initAppointmentUsecases>;
