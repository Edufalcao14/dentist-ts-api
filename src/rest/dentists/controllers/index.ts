import type { Usecases } from '@/usecases/index.js';
import { initGetAllDentistsController } from './get-all-dentists.js';
import { initGetDentistByIdController } from './get-dentist-by-id.js';
import { initCreateDentistController } from './create-dentist.js';
import { initUpdateDentistController } from './update-dentist.js';
import { initDeleteDentistController } from './delete-dentist.js';

export const initDentistControllers = (usecases: Usecases) => {
  return {
    getAll: initGetAllDentistsController(usecases),
    getById: initGetDentistByIdController(usecases),
    create: initCreateDentistController(usecases),
    update: initUpdateDentistController(usecases),
    delete: initDeleteDentistController(usecases),
  };
};

export type DentistControllers = ReturnType<typeof initDentistControllers>;
