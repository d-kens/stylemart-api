import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";



@Entity('tbl_users')
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'user_id'})
    id: string;

    @Column({ name: 'first_name', type: 'varchar', length: 50 })
    firstName: string;

    @Column({ name: 'last_name', type: 'varchar', length: 50 })
    lastName: string;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    email: string;

    @Column({ name: 'password_hash', nullable: false, type: 'varchar', length: 255 })
    passwordHash: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({ name: "update_at", type: 'timestamp' })
    updatedAt: Date;

    @ManyToMany(() => Role)
    @JoinTable()
    roles: Role[]

    constructor(user: Partial<User>) {
        Object.assign(this, user);
    }
}