import { PaymentStatus } from "src/payment-gateway/enums/payment-status";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  orderId: string;

  @Column()
  provider: string;

  @Column()
  description: string;

  @Column()
  amount: number;

  @Column()
  requestCode: string;

  @Column()
  responseCode?: string = "";

  @Column()
  status?: PaymentStatus = PaymentStatus.PENDING;

  @Column()
  paidAmount?: string = "0.00";

  @Column()
  receiptNumber?: string = "";

  @Column()
  responseDesc?: string = "";
}
