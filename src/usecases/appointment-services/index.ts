import { createAppointmentService } from './create-appointment-service.js';
import { getAllAppointmentServices } from './get-all-appointment-services.js';
import { getAppointmentServiceById } from './get-appointment-service-by-id.js';
import { updateAppointmentService } from './update-appointment-service.js';
import { deleteAppointmentService } from './delete-appointment-service.js';

export const initAppointmentServiceUsecases = () => {
  return {
    create: createAppointmentService,
    getAll: getAllAppointmentServices,
    getById: getAppointmentServiceById,
    update: updateAppointmentService,
    delete: deleteAppointmentService,
  };
};

export type AppointmentServiceUsecases = ReturnType<typeof initAppointmentServiceUsecases>;
