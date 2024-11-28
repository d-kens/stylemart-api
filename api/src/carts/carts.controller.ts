import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { CartItemDto } from './dto/cart-item.dto';

@Controller('carts')
export class CartsController {
    constructor(
        private cartsService: CartsService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getCart(@CurrentUser() user: User) {
        return await this.cartsService.getCart(user.id)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async addItemToCart(@CurrentUser() user: User, @Body() cartItemData: CartItemDto) {
        return this.cartsService.addItemToCart(user.id, cartItemData);
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async clearCart(@CurrentUser() user: User) {
        return this.cartsService.clearCart(user.id)
    }
}
