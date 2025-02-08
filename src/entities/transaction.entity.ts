import { PaymentStatus } from "src/payment-gateway/enums/payment-status";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Transaction {
  @ApiProperty({ description: 'Unique identifier for the transaction' })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({ description: 'Unique identifier for the order' })
  @Column()
  orderId: string;

  @ApiProperty({ description: 'Payment provider name' })
  @Column()
  provider: string;

  @ApiProperty({ description: 'Description of the transaction' })
  @Column()
  description: string;

  @ApiProperty({ description: 'Amount paid', example: 1000 })
  @Column()
  amount: number;

  @ApiProperty({ description: 'Request code from the payment provider' })
  @Column()
  requestCode: string;

  @ApiProperty({ description: 'Response code from the payment provider', default: '' })
  @Column()
  responseCode?: string = "";

  @ApiProperty({ enum: PaymentStatus, description: 'Current status of the transaction', default: PaymentStatus.PENDING })
  @Column()
  status?: PaymentStatus = PaymentStatus.PENDING;

  @ApiProperty({ description: 'Amount paid by the user', default: '0.00' })
  @Column()
  paidAmount?: string = "0.00";

  @ApiProperty({ description: 'Receipt number from the payment provider', default: '' })
  @Column()
  receiptNumber?: string = "";

  @ApiProperty({ description: 'Description of the response from the payment provider', default: '' })
  @Column()
  responseDesc?: string = "";
}
