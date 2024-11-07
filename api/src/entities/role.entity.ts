import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tbl_roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    @Column({ name: 'role_id' })
    id: number;

    @Column({ name: 'role_name', nullable: false, type: 'varchar', length: 20 })
    name: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({ name: "update_at", type: 'timestamp' })
    updatedAt: Date;
}