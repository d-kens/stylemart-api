import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('tbl_categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string;

    @ManyToOne(() => Category, (category) => category.subcategories, { nullable: true})
    @JoinColumn({ name: "parentCategoryId" })
    parentCategory: Category

    @OneToMany(() => Category, (category) => category.parentCategory)
    subcategories: Category[]

    @Column({ name: "parent_category_id", nullable: true })
    parentCategoryId: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: 'timestamp' })
    updatedAt: Date;
}