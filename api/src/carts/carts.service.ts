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
            cart = await this.cartsRepository.save(cart);
        }

        return cart;
    }

    /**
     * TODO: Fix this method, Query runners, transactions
     */
    async addItemToCart(userId: string, cartItemData: CartItemDto): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();


        try {
            const { productId, quantity } = cartItemData

            let cart = await this.getCart(userId);

            let cartItem = await this.cartItemsRepository.findOne({
                where: {cartId: cart.id, productId}
            });
            
            if (cartItem) {
                cartItem.quantity += quantity;
            } else {
                cartItem = this.cartItemsRepository.create({
                    cartId: cart.id,
                    productId,
                    quantity
                });
            }

            await queryRunner.manager.save(cartItem);

            const cartItems = await queryRunner.manager.find(CartItem, {
                where: { cartId: cart.id },
                relations: ['product']
            })

            cart.total = cartItems.reduce(
                (sum, item) => sum + item.quantity * item.product.price,
                0
            );

            await queryRunner.manager.save(cart);


            await queryRunner.commitTransaction();

            return true
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
