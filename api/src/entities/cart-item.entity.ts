import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "./product.entity";

@Entity('tbl_cart_items')
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: "cart_id" })
    cartId: string;

    @Column({ name: "product_id" })
    productId: string;

    @Column()
    quantity: number;

    @ManyToOne(() => Cart, (cart) => cart.cartItems)
    @JoinColumn({ name: "cartId"})
    cart: Cart;

    @OneToOne(() => Product)
    @JoinColumn({ name: "product_id"})
    product: Product;
}