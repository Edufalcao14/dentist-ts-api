import { createService } from './create-service.js';
import { getAllServices } from './get-all-services.js';
import { getServiceById } from './get-service-by-id.js';
import { updateService } from './update-service.js';
import { deleteService } from './delete-service.js';

export const initServiceUsecases = () => {
  return {
    create: createService,
    getAll: getAllServices,
    getById: getServiceById,
    update: updateService,
    delete: deleteService,
  };
};

export type ServiceUsecases = ReturnType<typeof initServiceUsecases>;
