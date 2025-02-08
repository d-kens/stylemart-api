import { IsEnum, IsPhoneNumber } from "class-validator";
import { TransactionType } from "../enums/transaction-type";
import { ApiProperty } from "@nestjs/swagger";

export class MobileMoney {
  @ApiProperty({ enum: TransactionType, description: 'Type of transaction' })
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @ApiProperty({ description: 'Phone number for the transaction', example: '+254712345678' })
  @IsPhoneNumber('KE')
  phoneNumber: string;
}
