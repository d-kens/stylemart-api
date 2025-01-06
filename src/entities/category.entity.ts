import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity("tbl_categories")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
