import { Body, Controller, Post, ValidationPipe, HttpCode, Req } from "@nestjs/common";
import { PaymentGatewayService } from "./payment-gateway.service";
import { PaymentRequest } from "./dtos/payment-request";
import { Logger } from "@firebase/logger";
import { MpesaResponse } from "./payment-providers/mpesa/dto/mpesa-response";
import { MpesaCallbackResponse } from "./payment-providers/mpesa/dto/mpesa-callback-response";
import { PaymentStatus } from "./enums/payment-status";
import { Providers } from "./enums/providers";
import { MpesaService } from "./payment-providers/mpesa/mpesa.service";
import { Request } from 'express';

@Controller("payment-gateway")
export class PaymentGatewayController {
  private readonly logger = new Logger(PaymentGatewayController.name);

  constructor(private paymentGatewayService: PaymentGatewayService) {}

  @Post("initiate-payment")
  async processPayment(@Body(ValidationPipe) paymentRequest: PaymentRequest) {
    this.logger.log(`Initiating payment for order: ${paymentRequest.orderId}`);
    return this.paymentGatewayService.initiatePayment(paymentRequest);
  }

  @Post("stk-callback")
  @HttpCode(200) 
  async callBack(@Body() paymentResponse: MpesaResponse, @Req() request: Request) {
    this.logger.log('========= M-PESA CALLBACK START =========');
    this.logger.log(`Received callback from IP: ${request.ip}`);
    this.logger.log(`Headers: ${JSON.stringify(request.headers)}`);
    this.logger.log(`Body: ${JSON.stringify(paymentResponse)}`);
    
    try {
      const provider = this.paymentGatewayService.getProvider(Providers.MPESA) as MpesaService;
      const result = await provider.handleCallback(paymentResponse);
      
      this.logger.log(`Callback processed successfully: ${JSON.stringify(result)}`);
      this.logger.log('========= M-PESA CALLBACK END =========');
      
      return result;
    } catch (error) {
      this.logger.error(`Callback processing failed: ${error.message}`);
      this.logger.error(error.stack);
      this.logger.log('========= M-PESA CALLBACK END =========');
      
      return new MpesaCallbackResponse("0", "Success");
    }
  }
}