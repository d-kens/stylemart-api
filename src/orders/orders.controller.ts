import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { Cart } from './dtos/cart-response';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}


    @UseGuards(JwtAuthGuard)
    @Get('cart-details')
    async getCartDetails(
        @CurrentUser() user: User,
        @Query('productIds') productIds: string
    ): Promise<Cart> {
        const idsArray = productIds.split(',');
        return await this.ordersService.getCartDetails(idsArray, user.id);
    }
}
