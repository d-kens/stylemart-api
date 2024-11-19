import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/entities/cart-item.entity';
import { Cart } from 'src/entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItemDto } from './dto/cart-item.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class CartsService {
    constructor(
        @InjectRepository(Cart)
        private cartsRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemsRepository: Repository<CartItem>,
        private readonly dataSource: DataSource,
    ) {}

    async getCart(userId: string): Promise<Cart> {

        let cart = await this.cartsRepository.findOne({
            where: { userId },
            relations: ['cartItems', 'cartItems.product'],
        })

        if(!cart) {
            cart = this.cartsRepository.create({userId, total: 0, cartItems: []});
            await this.cartsRepository.insert(cart);
        }

        return cart;
    }

    /**
     * TODO: Fix this method, Query runners, transactions
     */
    async addItemToCart(userId: string, cartItemData: CartItemDto): Promise<Cart> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();


        try {
            const { productId, quantity } = cartItemData

            let cart = await this.getCart(userId);

            let cartItem = await this.cartItemsRepository.findOne({
                where: {cartId: cart.id, productId}
            });

            if (cartItem) { // update cart item with quantity if it already exists

            } else { // create a new cart item it doesn exist

            }

            // Load cart items 

            // Calclate Cart Total

            // Update Cart with total

            // commit all transaction

            // return updated cart
 
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.error(err)
            throw new InternalServerErrorException('Failed to add item to cart');
        } finally {
            await queryRunner.release();
        }
    }



    private async updateCartTotal(cart: Cart): Promise<Cart> {
        const items = await this.cartItemsRepository.find({
            where: { cartId: cart.id },
            relations: ['product']
        })

        console.log(items)

        let total = 0;

        items.forEach(item => {
            total += item.product.price * item.quantity;
        });

        cart.total = total;
        return await this.cartsRepository.save(cart);
    }

 }
