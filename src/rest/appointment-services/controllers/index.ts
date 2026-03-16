import type { Usecases } from '@/usecases/index.js';
import { initGetAllAppointmentServicesController } from './get-all-appointment-services.js';
import { initGetAppointmentServiceByIdController } from './get-appointment-service-by-id.js';
import { initCreateAppointmentServiceController } from './create-appointment-service.js';
import { initUpdateAppointmentServiceController } from './update-appointment-service.js';
import { initDeleteAppointmentServiceController } from './delete-appointment-service.js';

export const initAppointmentServiceControllers = (usecases: Usecases) => {
  return {
    getAll: initGetAllAppointmentServicesController(usecases),
    getById: initGetAppointmentServiceByIdController(usecases),
    create: initCreateAppointmentServiceController(usecases),
    update: initUpdateAppointmentServiceController(usecases),
    delete: initDeleteAppointmentServiceController(usecases),
  };
};

export type AppointmentServiceControllers = ReturnType<typeof initAppointmentServiceControllers>;
