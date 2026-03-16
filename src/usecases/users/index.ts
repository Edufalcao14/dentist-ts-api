import { getAllUsers } from './get-all-users.js';
import { createUser } from './create-user.js';
import { getUserById } from './get-user-by-id.js';
import { updateUser } from './update-user.js';
import { deleteUser } from './delete-user.js';

export const initUserUsecases = () => {
  return {
    getAll: getAllUsers,
    getById: getUserById,
    create: createUser,
    update: updateUser,
    delete: deleteUser,
  };
};

export type UserUsecases = ReturnType<typeof initUserUsecases>;
