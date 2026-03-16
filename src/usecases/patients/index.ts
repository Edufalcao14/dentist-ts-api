import { createPatient } from './create-patient.js';
import { getAllPatients } from './get-all-patients.js';
import { getPatientById } from './get-patient-by-id.js';
import { updatePatient } from './update-patient.js';
import { deletePatient } from './delete-patient.js';

export const initPatientUsecases = () => {
  return {
    create: createPatient,
    getAll: getAllPatients,
    getById: getPatientById,
    update: updatePatient,
    delete: deletePatient,
  };
};

export type PatientUsecases = ReturnType<typeof initPatientUsecases>;
