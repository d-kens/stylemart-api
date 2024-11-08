import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tbl_users')
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'user_id'})
    id: string;

    @Column({ name: 'fullname', type: 'varchar', length: 100 })
    fullName: string

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    email: string;

    @Column({ name: 'password_hash', nullable: false, type: 'varchar', length: 255 })
    passwordHash: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: 'timestamp' })
    updatedAt: Date;


    constructor(user: Partial<User>) {
        Object.assign(this, user);
    }
}