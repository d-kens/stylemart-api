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

    /**
     * TODO: Imlelement:
            - Add item to cart
            - Remove Item from cart
            - Update item quantity
            - Get cart by user ID   
            - Clear user cart
     */
}
