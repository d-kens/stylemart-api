import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('tbl_categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string | null;

    @ManyToOne(() => Category, { nullable: true })
    @JoinColumn({ name: 'parent_cat_id' })
    parentCategory?: Category | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: 'timestamp' })
    updatedAt: Date;

    constructor(category: Partial<Category>)  {
        Object.assign(this, category);
    }
}