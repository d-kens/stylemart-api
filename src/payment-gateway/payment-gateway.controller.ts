import { Body, Controller, Post, ValidationPipe, HttpCode, Req, Logger, UseGuards } from "@nestjs/common";
import { PaymentGatewayService } from "./payment-gateway.service";
import { PaymentRequest } from "./dtos/payment-request";
import { MpesaResponse } from "./payment-providers/mpesa/dto/mpesa-response";
import { Request } from 'express';
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { Transaction } from "src/entities/transaction.entity";

@ApiTags('Payment Gateway') 
@Controller("payment-gateway")
export class PaymentGatewayController {
  private readonly logger = new Logger(PaymentGatewayController.name);

  constructor(private paymentGatewayService: PaymentGatewayService) {}

  @UseGuards(JwtAuthGuard)
  @Post("initiate-payment")
  @ApiOperation({ summary: 'Initiate a payment' }) 
  @ApiBody({ type: PaymentRequest }) 
  @ApiResponse({ status: 200, description: 'Payment initiated successfully.', type: Transaction })
  @ApiResponse({ status: 400, description: 'Invalid payment request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  async processPayment(@Body(ValidationPipe) paymentRequest: PaymentRequest): Promise<Transaction> {
    this.logger.log(`Initiating payment for order: ${JSON.stringify(paymentRequest)}`);
    return this.paymentGatewayService.initiatePayment(paymentRequest);
  }

  @Post("stk-callback")
  async callBack(@Body() paymentResponse: MpesaResponse, @Req() request: Request) {
    // Implementation for handling the callback can be added here
  }
}
