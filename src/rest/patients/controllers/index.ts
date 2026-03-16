import type { Usecases } from '@/usecases/index.js';
import { initGetAllPatientsController } from './get-all-patients.js';
import { initGetPatientByIdController } from './get-patient-by-id.js';
import { initCreatePatientController } from './create-patient.js';
import { initUpdatePatientController } from './update-patient.js';
import { initDeletePatientController } from './delete-patient.js';

export const initPatientControllers = (usecases: Usecases) => {
  return {
    getAll: initGetAllPatientsController(usecases),
    getById: initGetPatientByIdController(usecases),
    create: initCreatePatientController(usecases),
    update: initUpdatePatientController(usecases),
    delete: initDeletePatientController(usecases),
  };
};

export type PatientControllers = ReturnType<typeof initPatientControllers>;
