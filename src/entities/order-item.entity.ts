import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./product.entity";
import { Order } from "./order.entity";

@Entity("tbl_order_items")
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column("int")
  quantity: number;

  @OneToOne(() => Product, (product) => product.orderItem)
  product: Product;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;
}
