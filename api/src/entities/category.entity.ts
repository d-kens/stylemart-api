import { AbstractEntity } from "src/database/abstract.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('tbl_categories')
export class Category extends AbstractEntity<Category> {
    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string | null;

    @ManyToOne(() => Category, { nullable: true })
    @JoinColumn({ name: 'parent_cat_id' })
    parentCategory?: Category | null;
}