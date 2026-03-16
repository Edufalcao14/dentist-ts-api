import { createDentist } from './create-dentist.js';
import { getAllDentists } from './get-all-dentists.js';
import { getDentistById } from './get-dentist-by-id.js';
import { updateDentist } from './update-dentist.js';
import { deleteDentist } from './delete-dentist.js';

export const initDentistUsecases = () => {
  return {
    create: createDentist,
    getAll: getAllDentists,
    getById: getDentistById,
    update: updateDentist,
    delete: deleteDentist,
  };
};

export type DentistUsecases = ReturnType<typeof initDentistUsecases>;
