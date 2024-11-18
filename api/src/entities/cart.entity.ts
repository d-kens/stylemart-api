import { AbstractEntity } from "src/database/abstract.entity";
import { User } from "./user.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";


@Entity('tbl_carts')
export class Cart extends AbstractEntity<Cart> {

    @Column({ name: "user_id"})
    userId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    total: number;

    @OneToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;
}