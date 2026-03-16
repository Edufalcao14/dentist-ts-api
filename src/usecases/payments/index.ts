import { createPayment } from './create-payment.js';
import { getAllPayments } from './get-all-payments.js';
import { getPaymentById } from './get-payment-by-id.js';
import { updatePayment } from './update-payment.js';
import { deletePayment } from './delete-payment.js';

export const initPaymentUsecases = () => {
  return {
    create: createPayment,
    getAll: getAllPayments,
    getById: getPaymentById,
    update: updatePayment,
    delete: deletePayment,
  };
};

export type PaymentUsecases = ReturnType<typeof initPaymentUsecases>;
