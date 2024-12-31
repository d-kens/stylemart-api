import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentRequest } from './dtos/payment-request';

@Controller('payment-gateway')
export class PaymentGatewayController {
  constructor(private paymentGatewayService: PaymentGatewayService) {}

  @Post('initiate-payment')
  async processPayment(@Body(ValidationPipe) paymentRequest: PaymentRequest) {
    return this.paymentGatewayService.initiatePayment(paymentRequest);
  }
}
