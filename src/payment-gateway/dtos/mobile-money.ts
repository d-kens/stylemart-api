import { IsEnum, IsPhoneNumber } from "class-validator";
import { TransactionType } from "../enums/transaction-type";

export class MobileMoney {
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @IsPhoneNumber()
  phoneNumber: string;
}
