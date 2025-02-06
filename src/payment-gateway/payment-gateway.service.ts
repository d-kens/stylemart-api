import { Injectable, Logger } from "@nestjs/common";
import { PaymentRequest } from "./dtos/payment-request";
import { Providers } from "./enums/providers";
import { PaymentProvider } from "./payment-providers/payment-provider.interface";
import { MpesaService } from "./payment-providers/mpesa/mpesa.service";
import { TransactionsService } from "./transactions/transactions.service";

@Injectable()
export class PaymentGatewayService {
  logger = new Logger(PaymentGatewayService.name);

  private readonly paymentProviders: Map<Providers, PaymentProvider> = new Map<Providers,PaymentProvider>();

  constructor(
    private readonly mpesa: MpesaService,
    private readonly transactionService: TransactionsService,
  ) {
    this.paymentProviders = this.paymentProviders.set(Providers.MPESA, mpesa);
  }

  async initiatePayment(paymentRequest: PaymentRequest): Promise<any> {
    const selectedProvider = this.paymentProviders.get(paymentRequest.provider);

    if (!selectedProvider) {
      throw new Error("Invalid payment provider selected.");
    }

    return selectedProvider.initiatePayment(paymentRequest);
  }
}