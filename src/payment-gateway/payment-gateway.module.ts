import { Module } from "@nestjs/common";
import { PaymentGatewayService } from "./payment-gateway.service";
import { PaymentGatewayController } from "./payment-gateway.controller";
import { MpesaModule } from "./payment-providers/mpesa/mpesa.module";
import { TransactionsModule } from "./transactions/transactions.module";

@Module({
  imports: [MpesaModule, TransactionsModule],
  providers: [PaymentGatewayService],
  controllers: [PaymentGatewayController],
})
export class PaymentGatewayModule {}
