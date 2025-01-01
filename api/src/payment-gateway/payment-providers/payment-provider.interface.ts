import { PaymentRequest } from '../dtos/payment-request';

export interface PaymentProvider {
  authenticate(): Promise<string>;

  initiatePayment(paymentRequest: PaymentRequest): Promise<any>;
}
