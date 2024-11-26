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

    async getUserCart(userId: string) {

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
