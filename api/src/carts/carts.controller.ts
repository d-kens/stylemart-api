import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
    @Post('add-item')
    async addItemToCart(@CurrentUser() user: User, @Body() cartItemData: CartItemDto) {
        return this.cartsService.addItemToCart(user.id, cartItemData);
    }
}
