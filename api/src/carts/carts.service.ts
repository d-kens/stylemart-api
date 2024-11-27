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

    }

    async removeItemFromCart(userId: string, cartItemData) {

    }

    async updateCartItemQuantity(userId: string, cartItemId: string, quantity: number) {

    } 

    async clearCart(userId: string) {

    }
}
