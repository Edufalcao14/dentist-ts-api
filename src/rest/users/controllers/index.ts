import type { Usecases } from '@/usecases/index.js';
import { initGetAllUsersController } from './get-all-users.js';
import { initGetUserByIdController } from './get-user-by-id.js';
import { initCreateUserController } from './create-user.js';
import { initUpdateUserController } from './update-user.js';
import { initDeleteUserController } from './delete-user.js';

export const initUserControllers = (usecases: Usecases) => {
  return {
    getAll: initGetAllUsersController(usecases),
    getById: initGetUserByIdController(usecases),
    create: initCreateUserController(usecases),
    update: initUpdateUserController(usecases),
    delete: initDeleteUserController(usecases),
  };
};

export type UserControllers = ReturnType<typeof initUserControllers>;
