import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { OrderItem } from "./order-item.entity";
import { OrderStatus } from "src/enums/order-status.enum";
import { ApiProperty } from "@nestjs/swagger"; 

@Entity("tbl_orders")
export class Order {
  @ApiProperty({ description: "Unique identifier for the order", type: String })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ description: "Total amount for the order", type: "number", default: 0 })
  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  total: number;

  @ApiProperty({ description: "Current status of the order", enum: OrderStatus, default: OrderStatus.PENDING })
  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  orderStatus: OrderStatus;

  @ApiProperty({ description: "Timestamp when the order was created", type: String, format: "date-time" }) 
  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @ApiProperty({ description: "Timestamp when the order was last updated", type: String, format: "date-time" }) 
  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @ApiProperty({ description: "User who placed the order", type: () => User }) 
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ApiProperty({ description: "Items associated with the order", type: () => [OrderItem], nullable: true }) 
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems?: OrderItem[];
}
