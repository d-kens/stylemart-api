import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "./product.entity";

@Entity('tbl_cart_items')
export class CartItems {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: "cart_id"})
    cartId: string;

    @Column({ name: "product_id"})
    productId: string;

    @Column()
    quantity: number;

    @ManyToOne(() => Cart)
    @JoinColumn({ name: "cart_id"})
    cart: Cart;

    @OneToOne(() => Product)
    @JoinColumn({ name: "product_id"})
    product: Product;
}