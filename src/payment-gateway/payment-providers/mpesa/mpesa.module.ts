import { Module } from "@nestjs/common";
import { MpesaService } from "./mpesa.service";
import { MpesaController } from "./mpesa.controller";
import { TransactionsModule } from "src/payment-gateway/transactions/transactions.module";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [TransactionsModule, HttpModule],
  providers: [MpesaService],
  controllers: [MpesaController],
  exports: [MpesaService],
})
export class MpesaModule {}
