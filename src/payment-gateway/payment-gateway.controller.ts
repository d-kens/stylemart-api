import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentRequest } from './dtos/payment-request';
import { Logger } from '@firebase/logger';
import { MpesaResponse } from './payment-providers/mpesa/dto/mpesa-response';
import { MpesaCallbackResponse } from './payment-providers/mpesa/dto/mpesa-callback-response';

@Controller('payment-gateway')
export class PaymentGatewayController {
  logger = new Logger(PaymentGatewayController.name);
  constructor(private paymentGatewayService: PaymentGatewayService) {}

  @Post('initiate-payment')
  async processPayment(@Body(ValidationPipe) paymentRequest: PaymentRequest) {
    return this.paymentGatewayService.initiatePayment(paymentRequest);
  }

  @Post('stk-callback')
  async callBack(@Body() paymentResponse: any | MpesaResponse) {
    this.logger.log("MPESA STK CALLBACK" + JSON.stringify(paymentResponse));
    return new MpesaCallbackResponse('0', 'Accepted');
  }
}
