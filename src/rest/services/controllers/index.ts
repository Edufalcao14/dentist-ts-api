import type { Usecases } from '@/usecases/index.js';
import { initGetAllServicesController } from './get-all-services.js';
import { initGetServiceByIdController } from './get-service-by-id.js';
import { initCreateServiceController } from './create-service.js';
import { initUpdateServiceController } from './update-service.js';
import { initDeleteServiceController } from './delete-service.js';

export const initServiceControllers = (usecases: Usecases) => {
  return {
    getAll: initGetAllServicesController(usecases),
    getById: initGetServiceByIdController(usecases),
    create: initCreateServiceController(usecases),
    update: initUpdateServiceController(usecases),
    delete: initDeleteServiceController(usecases),
  };
};

export type ServiceControllers = ReturnType<typeof initServiceControllers>;
