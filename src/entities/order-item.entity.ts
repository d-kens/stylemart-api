import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./product.entity";
import { Order } from "./order.entity";
import { ApiProperty } from "@nestjs/swagger"; 

@Entity("tbl_order_items")
export class OrderItem {
  @ApiProperty({ description: "Unique identifier for the order item", type: String }) 
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ description: "Price of the order item", type: "number" }) 
  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: "Name of the order item", type: String }) 
  @Column()
  name: string;

  @ApiProperty({ description: "Quantity of the order item", type: "number" })
  @Column("int")
  quantity: number;

  @ApiProperty({ description: "Product associated with the order item", type: () => Product }) 
  @ManyToOne(() => Product, (product) => product.orderItems)
  product: Product;

  @ApiProperty({ description: "Order associated with the order item", type: () => Order }) 
  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;
}
