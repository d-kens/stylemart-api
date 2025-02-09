import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity("tbl_categories")
export class Category {
  @ApiProperty({ description: "Unique identifier for the category", example: "550e8400-e29b-41d4-a716-446655440000" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ description: "The name of the category", example: "Electronics" })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: "List of products under this category", type: () => [Product] })
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
