import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { CartItemDto } from './dto/cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@Controller('carts')
export class CartsController {
    constructor(
        private cartsService: CartsService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getCart(@CurrentUser() user: User): Promise<CartResponseDto> {
        const result =  await this.cartsService.getCart(user.id);
        return new CartResponseDto(result)
    }

    @UseGuards(JwtAuthGuard)
    @Post('items')
    async addItemToCart(@CurrentUser() user: User, @Body() cartItemData: CartItemDto): Promise<CartResponseDto> {
        const result =  await this.cartsService.addItemToCart(user.id, cartItemData);
        return new CartResponseDto(result)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('items/:cartItemId')
    async updateCartItemQuantity(
        @CurrentUser() user: User,
        @Param('cartItemId') cartItemId: string,
        @Body('quantity') quantity: number,
    ) { 
        const result = await this.cartsService.updateCartItemQuantity(user.id, cartItemId, quantity);
        return new CartResponseDto(result)
    }

    @UseGuards(JwtAuthGuard)
    @Delete('items')
    async clearCart( @CurrentUser() user: User): Promise<CartResponseDto> {
        const resutl =  await this.cartsService.clearCart(user.id);
        return new CartResponseDto(resutl);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('items/:cartItemId')
    async removeItemFromCart(
        @CurrentUser() user: User,
        @Param('cartItemId') cartItemId: string
    ) {
        const result = await this.cartsService.removeItemFromCart(user.id, cartItemId);
        return new CartResponseDto(result);
    }
 
}
