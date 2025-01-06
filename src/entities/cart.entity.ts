import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { CartItem } from "./cart-item.entity";

@Entity("tbl_carts")
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  total: number;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  user: User;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems?: CartItem[];
}
