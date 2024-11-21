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
    
    async addItemToCart(userId: string, cartItemData: CartItemDto): Promise<Cart> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
            const { productId, quantity } = cartItemData;
    
            let cart = await this.getCart(userId);
    
            let cartItem = await this.cartItemsRepository.findOne({
                where: { cartId: cart.id, productId },
            });
    
            if (cartItem) {
                await queryRunner.manager.update(
                    CartItem,
                    { id: cartItem.id },
                    { quantity: cartItem.quantity + quantity }
                );
            } else {
                cartItem = queryRunner.manager.create(CartItem, {
                    cartId: cart.id,
                    productId,
                    quantity,
                });
                await queryRunner.manager.insert(CartItem, cartItem);
            }
    
            const cartItems = await queryRunner.manager.find(CartItem, {
                where: { cartId: cart.id },
                relations: ['product'], 
            });
    
            let cartTotal = 0;
            for (const item of cartItems) {
                if (item.product) {
                    cartTotal += item.product.price * item.quantity;
                }
            }
    
            cart.total = cartTotal;
            await queryRunner.manager.update(Cart, cart.id, { total: cartTotal });
    
            await queryRunner.commitTransaction();
    
            return cart;
    
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Failed to add item to cart');
        } finally {
            await queryRunner.release();
        }
    }
    
 }
