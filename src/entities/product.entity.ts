import { Size } from "src/enums/size.enum";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Category } from "./category.entity";
import { OrderItem } from "./order-item.entity";
import { CartItem } from "./cart-item.entity";

@Entity("tbl_products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column({ type: "text" })
  description: string;

  @Column({ length: 50 })
  brand: string;

  @Column({ type: "enum", enum: Size })
  size: Size;

  @Column({ nullable: true })
  color: string;

  @Column("int", { default: 0 })
  stock: number;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToOne(() => OrderItem, (orderItem) => orderItem.product)
  orderItem: OrderItem;

  @OneToOne(() => CartItem, (cartItem) => cartItem.product)
  cartItem: CartItem;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;
}
