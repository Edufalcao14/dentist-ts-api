import { createTenant } from './create-tenant.js';
import { getTenantById } from './get-tenant-by-id.js';
import { updateTenant } from './update-tenant.js';
import { deleteTenant } from './delete-tenant.js';

export const initTenantUsecases = () => {
  return {
    create: createTenant,
    getById: getTenantById,
    update: updateTenant,
    delete: deleteTenant,
  };
};

export type TenantUsecases = ReturnType<typeof initTenantUsecases>;
