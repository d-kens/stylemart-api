import {
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Providers } from '../enums/providers';
import { Type } from 'class-transformer';
import { MobileMoney } from './mobile-money';

export class PaymentRequest {
  @IsString()
  orderId: string;

  @IsNumber()
  amount: number;

  @IsEnum(Providers)
  provider: Providers;

  @ValidateIf((o) => o.provider === Providers.MPESA)
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => MobileMoney)
  mobile: MobileMoney;
}
