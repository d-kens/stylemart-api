import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoleEnum } from "../enums/role.enum";

@Entity('tbl_roles')
export class Role {
    @PrimaryGeneratedColumn('uuid', { name: 'role_id'})
    id: string;

    @Column({
        name: 'role_name',
        type: 'enum',
        enum: RoleEnum,
        nullable: false
    })
    name: RoleEnum;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({ name: "update_at", type: 'timestamp' })
    updatedAt: Date;
}