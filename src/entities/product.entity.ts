import { Size } from "src/enums/size.enum";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Category } from "./category.entity";
import { OrderItem } from "./order-item.entity";
import { CartItem } from "./cart-item.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("tbl_products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  @ApiProperty({ description: 'Unique identifier of the product' })
  id: string;

  @Column({ length: 100 })
  @ApiProperty({ description: 'Name of the product', maxLength: 100 })
  name: string;

  @Column("decimal", { precision: 10, scale: 2 })
  @ApiProperty({ description: 'Price of the product', type: 'number', example: 19.99 })
  price: number;

  @Column({ type: "text" })
  @ApiProperty({ description: 'Description of the product' })
  description: string;

  @Column({ length: 50 })
  @ApiProperty({ description: 'Brand of the product', maxLength: 50 })
  brand: string;

  @Column({ type: "enum", enum: Size })
  @ApiProperty({ description: 'Size of the product', enum: Size })
  size: Size;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Color of the product', nullable: true })
  color: string;

  @Column("int", { default: 0 })
  @ApiProperty({ description: 'Available stock of the product', default: 0 })
  stock: number;

  @Column({ nullable: true })
  @ApiProperty({ description: 'URL of the product image', nullable: true })
  imageUrl: string;

  @ManyToOne(() => Category, (category) => category.products)
  @ApiProperty({ description: 'Category of the product' })
  category: Category;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  @ApiProperty({ description: 'Order items associated with the product' })
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  @ApiProperty({ description: 'Cart items associated with the product' })
  cartItems: CartItem[];

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  @ApiProperty({ description: 'Creation date of the product', type: 'string', format: 'date-time' })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  @ApiProperty({ description: 'Last update date of the product', type: 'string', format: 'date-time' })
  updatedAt: Date;
}
