import type { Usecases } from '@/usecases/index.js';
import { initCreateTenantController } from './create-tenant.js';
import { initGetTenantByIdController } from './get-tenant-by-id.js';
import { initUpdateTenantController } from './update-tenant.js';
import { initDeleteTenantController } from './delete-tenant.js';

export const initTenantControllers = (usecases: Usecases) => {
  return {
    create: initCreateTenantController(usecases),
    getById: initGetTenantByIdController(usecases),
    update: initUpdateTenantController(usecases),
    delete: initDeleteTenantController(usecases),
  };
};

export type TenantControllers = ReturnType<typeof initTenantControllers>;
