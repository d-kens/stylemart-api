import { IsEnum, IsNotEmptyObject, IsNumber, IsString, ValidateIf, ValidateNested } from "class-validator";
import { Providers } from "../enums/providers";
import { Type } from "class-transformer";
import { MobileMoney } from "./mobile-money";
import { ApiProperty } from "@nestjs/swagger";

export class PaymentRequest {
  @ApiProperty({ description: 'Unique identifier for the order' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Amount to be paid', example: 1000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ 
    enum: Providers, 
    description: 'Payment provider', 
    example: Providers.MPESA 
  })
  @IsEnum(Providers)
  provider: Providers;

  @ValidateIf((o) => o.provider === Providers.MPESA)
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => MobileMoney)
  @ApiProperty({ type: MobileMoney, description: 'Mobile money details for MPESA' })
  mobile: MobileMoney;
}
