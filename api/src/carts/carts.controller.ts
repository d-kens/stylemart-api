import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
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
    @Post('items')
    async addItemToCart(@CurrentUser() user: User, @Body() cartItemData: CartItemDto) {
        return this.cartsService.addItemToCart(user.id, cartItemData);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('items/:cartItemId')
    async updateCartItemQuantity(
        @CurrentUser() user: User,
        @Param('cartItemId') cartItemId: string,
        @Body('quantity') quantity: number,
    ) {
        return this.cartsService.updateCartItemQuantity(user.id, cartItemId, quantity)
    }

    @UseGuards(JwtAuthGuard)
    @Delete('items')
    async clearCart( @CurrentUser() user: User) {
        return this.cartsService.clearCart(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('items/:cartItemId')
    async removeItemFromCart(
        @CurrentUser() user: User,
        @Param('cartItemId') cartItemId: string
    ) {
        return this.cartsService.removeItemFromCart(user.id, cartItemId)
    }
 
}
