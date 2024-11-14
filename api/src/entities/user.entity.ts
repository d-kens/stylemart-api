import { AbstractEntity } from "src/database/abstract.entity";
import { RoleEnum } from "src/enums/role.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tbl_users')
export class User extends AbstractEntity<User> {
    @Column({ name: 'fullname', type: 'varchar', length: 100 })
    fullName: string

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    email: string;

    @Column({ name: 'password_hash', nullable: false, type: 'varchar', length: 255 })
    passwordHash: string;

    @Column({ nullable: true })
    refreshToken?: string;

    @Column({
        type: 'enum',
        enum: RoleEnum,
        default: RoleEnum.USER
    })
    role: RoleEnum
}