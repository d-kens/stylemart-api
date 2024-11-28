import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { CartItemDto } from './dto/cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('cart managemnet endpoints')
@ApiResponse({ status: 500, description: 'Internal server error.' })
@Controller('carts')
export class CartsController {
    constructor(
        private cartsService: CartsService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Retrieve cart for the current logged in user' })
    @ApiOkResponse({
        description: 'Current logged in user cart',
        type: [CartResponseDto]
    })
    async getCart(@CurrentUser() user: User): Promise<CartResponseDto> {
        const result =  await this.cartsService.getCart(user.id);
        return new CartResponseDto(result)
    }

    @UseGuards(JwtAuthGuard)
    @Post('items')
    @ApiOperation({ summary: 'Add product to cart'})
    @ApiCreatedResponse({ 
        description: 'Update cart for the user.',
        type: CartResponseDto
    })
    @ApiBadRequestResponse({ description: 'Validation failed. Check the request body for required fields and correct data types.',})
    async addItemToCart(@CurrentUser() user: User, @Body(ValidationPipe) cartItemData: CartItemDto): Promise<CartResponseDto> {
        const result =  await this.cartsService.addItemToCart(user.id, cartItemData);
        return new CartResponseDto(result)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('items/:cartItemId')
    @ApiOperation({ summary: 'Update cart item quatity'})
    @ApiCreatedResponse({ 
        description: 'Updated cart for the user',
        type: CartResponseDto
    })
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
    @ApiOperation({ summary: 'Clear current logged in user cart' }) 
    @ApiCreatedResponse({ 
        description: 'Updated cart for the user',
        type: CartResponseDto
    })
    async clearCart( @CurrentUser() user: User): Promise<CartResponseDto> {
        const result =  await this.cartsService.clearCart(user.id);
        return new CartResponseDto(result);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('items/:cartItemId')
    @ApiOperation({ summary: 'Remove item form the  current logged in user cart' }) 
    @ApiCreatedResponse({ 
        description: 'Updated cart for the user',
        type: CartResponseDto
    })
    async removeItemFromCart(
        @CurrentUser() user: User,
        @Param('cartItemId') cartItemId: string
    ) {
        const result = await this.cartsService.removeItemFromCart(user.id, cartItemId);
        return new CartResponseDto(result);
    }
 
}
