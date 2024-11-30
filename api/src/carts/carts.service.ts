import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/entities/cart-item.entity';
import { Cart } from 'src/entities/cart.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CartItemDto } from './dto/cart-item.dto';
import { DataSource } from 'typeorm';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class CartsService {
    constructor(
        @InjectRepository(Cart)
        private cartsRepository: Repository<Cart>,

        @InjectRepository(CartItem)
        private cartItemsRepository: Repository<CartItem>,

        private readonly dataSource: DataSource,
    ) {}


    private async createCart(userId: string): Promise<Cart> {
        try {
            const cart = this.cartsRepository.create({
                total: 0,
                user: { id: userId },
                cartItems: []
            });
    
            return this.cartsRepository.save(cart)

        } catch (error) {
            throw new InternalServerErrorException('Failed to create cart');
        }
    
    }

    async getCart(userId: string): Promise<Cart> {
        try {
            let cart = await this.cartsRepository.findOne({
                where: { user: { id: userId}}
            });

            return cart || this.createCart(userId);

        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Error retrieving user cart');
        }
    }

    async addItemToCart(userId: string, cartItemData: CartItemDto): Promise<Cart> {
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
            
            const cartItems = await queryRunner.manager.find(CartItem, { where: { cart: { id: cart.id }}});

            cart.total = await this.calculateCartTotal(cartItems);
            cart.cartItems = cartItems;

            await queryRunner.manager.save(cart)
            await queryRunner.commitTransaction();

            return cart;
        
        } catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Failed to add item to cart');
        } finally {
            await queryRunner.release();
        }

    }

    async updateCartItemQuantity(userId: string, cartItemId: string, quantity: number): Promise<Cart> {
        let cart = await this.getCart(userId);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let cartItem = await queryRunner.manager.findOne(CartItem, { where: { id: cartItemId } });
            cartItem.quantity += quantity;
            await queryRunner.manager.update(CartItem, cartItemId, cartItem);

            const cartItems = await queryRunner.manager.find(CartItem, { where: { cart: { id: cart.id }}});
            cart.total = await this.calculateCartTotal(cartItems);
            cart.cartItems = cartItems

            await queryRunner.manager.save(cart);
            await queryRunner.commitTransaction();

            return cart;
 
        } catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException("Failed to update cart quatity");
        } finally {
            await queryRunner.release();
        }
    }

    async removeItemFromCart(userId: string, cartItemId: string): Promise<Cart> {

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let cart = await this.getCart(userId);

        try {
            await queryRunner.manager.delete(CartItem, cartItemId);
        
            const cartItems = await queryRunner.manager.find(CartItem, { where: { cart: { id: cart.id }}});

            cart.total = await this.calculateCartTotal(cartItems);
            cart.cartItems = cartItems;

            await queryRunner.manager.save(cart)
            await queryRunner.commitTransaction();

            return cart;

        } catch {
            queryRunner.rollbackTransaction();
            throw new InternalServerErrorException("Failed to remove item from cart");
        } finally {
            queryRunner.release();
        }

    }

    
    async clearCart(userId: string): Promise<Cart> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let cart = await this.getCart(userId);

        try {
            await queryRunner.manager.delete(CartItem, { cart: { id: cart.id } });

            cart.total = 0;
            cart.cartItems = []

            await queryRunner.manager.save(cart);

            await queryRunner.commitTransaction();
            return cart;    

        } catch (error) {

            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Failed to clear cart')

        } finally {
            await queryRunner.release();
        }
    }

    private async calculateCartTotal(cartItems: CartItem[]): Promise<number> {
        let cartTotal = 0;

        for(let i = 0; i < cartItems.length; i++) {
            cartTotal += cartItems[i].quantity * cartItems[i].product.price
        }
        
        return cartTotal;
    }
}
