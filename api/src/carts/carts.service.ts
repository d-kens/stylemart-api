import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/entities/cart-item.entity';
import { Cart } from 'src/entities/cart.entity';
import { QueryRunner, Repository } from 'typeorm';
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

    async getCart(userId: string) {
        try {

            let cart = await this.cartsRepository.findOne({
                where: { user: { id: userId}}
            });

            if(!cart) {
                cart =  this.cartsRepository.create({
                    total: 0,
                    user: { id: userId },
                    cartItems: []
                });

                await this.cartsRepository.insert(cart);
            }

            return cart;

        } catch (error) {
            throw new InternalServerErrorException('Error retrieving user cart');
        }
    }

    async addItemToCart(userId: string, cartItemData: CartItemDto) {
        let cart = await this.getCart(userId);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let cartItem = await queryRunner.manager.findOne(CartItem, {
                where: { cart: { id: cart.id }, product: { id: cartItemData.productId } }
            });

            if(cartItem) {
                cartItem.quantity += cartItemData.quantity;
                await queryRunner.manager.update(CartItem, cartItem.id, cartItem)
            } else {
                cartItem = this.cartItemsRepository.create({
                    quantity: cartItemData.quantity,
                    product: { id: cartItemData.productId },
                    cart: { id: cart.id },
                })
                await queryRunner.manager.insert(CartItem, cartItem)
            }
            
            const cartItems = await queryRunner.manager.find(CartItem, { where: cart });
            cart.total = await this.calculateCartTotal(cartItems);

            return await queryRunner.manager.save(cart)
        
        } catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Failed to add item to cart');
        } finally {
            await queryRunner.release();
        }

    }

    async removeItemFromCart(userId: string, cartItemId: string) {

    }

    async updateCartItemQuantity(userId: string, cartItemId: string, quantity: number) {
        let cart = await this.getCart(userId);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let cartItem = await queryRunner.manager.findOne(CartItem, { where: { id: cartItemId } });
            cartItem.quantity += quantity;
            await queryRunner.manager.update(CartItem, cartItemId, cartItem);

            const cartItems = await queryRunner.manager.find(CartItem, { where: cart });
            cart.total = await this.calculateCartTotal(cartItems);

            return await queryRunner.manager.save(cart)
 
        } catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException("Failed to update cart quatity");
        } finally {
            await queryRunner.release();
        }
    } 

    async clearCart(userId: string): Promise<Cart> {
        let cart = await this.getCart(userId);
        try {
            cart.cartItems = [];
            cart.total = 0;
            return this.cartsRepository.save(cart)
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException('Failed to clear cart')
        }
    }

    private async calculateCartTotal(cartItems: CartItem[]): Promise<number> {
        let cartTotal = 0;

        for(let i = 0; i < cartItems.length; i++) {
            cartTotal += cartItems[i].quantity * cartItems[i].product.price
        }

        console.log("This is the cart total for the calculate cart total function: ", cartTotal)
        return cartTotal;
    }
}
