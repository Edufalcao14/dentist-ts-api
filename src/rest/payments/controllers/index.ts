import type { Usecases } from '@/usecases/index.js';
import { initGetAllPaymentsController } from './get-all-payments.js';
import { initGetPaymentByIdController } from './get-payment-by-id.js';
import { initCreatePaymentController } from './create-payment.js';
import { initUpdatePaymentController } from './update-payment.js';
import { initDeletePaymentController } from './delete-payment.js';

export const initPaymentControllers = (usecases: Usecases) => {
  return {
    getAll: initGetAllPaymentsController(usecases),
    getById: initGetPaymentByIdController(usecases),
    create: initCreatePaymentController(usecases),
    update: initUpdatePaymentController(usecases),
    delete: initDeletePaymentController(usecases),
  };
};

export type PaymentControllers = ReturnType<typeof initPaymentControllers>;
