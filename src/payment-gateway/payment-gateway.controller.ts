import { Body, Controller, Post, ValidationPipe, HttpCode, Req, Logger } from "@nestjs/common";
import { PaymentGatewayService } from "./payment-gateway.service";
import { PaymentRequest } from "./dtos/payment-request";
import { MpesaResponse } from "./payment-providers/mpesa/dto/mpesa-response";
import { Request } from 'express';

@Controller("payment-gateway")
export class PaymentGatewayController {
  private readonly logger = new Logger(PaymentGatewayController.name);

  constructor(private paymentGatewayService: PaymentGatewayService) {}


  @Post("initiate-payment")
  async processPayment(@Body(ValidationPipe) paymentRequest: PaymentRequest) {
    this.logger.log("Pay Pay Pay");
    this.logger.log(`Initiating payment for order: ${JSON.stringify(paymentRequest)}`);

    // TODO: Include Daraja API  Env Variables
    // TODO: Implement STK mpesa STK push
    return this.paymentGatewayService.initiatePayment(paymentRequest);
  }

  @Post("stk-callback")
  @HttpCode(200) 
  async callBack(@Body() paymentResponse: MpesaResponse, @Req() request: Request) {}
}