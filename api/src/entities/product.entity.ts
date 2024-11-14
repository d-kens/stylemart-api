import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { AbstractEntity } from "src/database/abstract.entity";


@Entity('tbl_products')
export class Product extends AbstractEntity<Product> {

    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({nullable: true, type: 'text' })
    description?: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number;

    @Column({ type: 'integer', nullable: false })
    stock: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    imageUrl: string;

    @ManyToOne(() => Category, (category) => category.id)
    @JoinColumn({ name: 'category_id'})
    category: Category

    @Column({ name: 'category_id', type: 'uuid', nullable: false })
    categoryId: string;
}