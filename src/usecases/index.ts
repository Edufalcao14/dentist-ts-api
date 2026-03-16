import { initUserUsecases } from './users/index.js';
import { initAuthUsecases } from './auth/index.js';
import { initTenantUsecases } from './tenants/index.js';
import { initDentistUsecases } from './dentists/index.js';
import { initPatientUsecases } from './patients/index.js';
import { initServiceUsecases } from './services/index.js';
import { initAppointmentUsecases } from './appointments/index.js';
import { initAppointmentServiceUsecases } from './appointment-services/index.js';
import { initPaymentUsecases } from './payments/index.js';

export const initUsecases = () => {
  return {
    auth: initAuthUsecases(),
    user: initUserUsecases(),
    tenant: initTenantUsecases(),
    dentist: initDentistUsecases(),
    patient: initPatientUsecases(),
    service: initServiceUsecases(),
    appointment: initAppointmentUsecases(),
    appointmentService: initAppointmentServiceUsecases(),
    payment: initPaymentUsecases(),
  };
};

export type Usecases = ReturnType<typeof initUsecases>;
