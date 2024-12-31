import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_otps')
export class OTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  otp: string;

  @Column()
  expiryTime: string;

  @Column({ default: false })
  verified: boolean;
}
