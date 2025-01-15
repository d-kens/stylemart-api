import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { CartService } from "./cart.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { User } from "src/entities/user.entity";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { CartItemResponseDto, UpdateCartItemDto } from "./dto/cart.dto";

@Controller("cart/items")
export class CartController {
  constructor(private cartService: CartService) {}


  @UseGuards(JwtAuthGuard)
  @Get()
  async getCart(@CurrentUser() user: User): Promise<CartItemResponseDto[]> {
    const cart = await this.cartService.getCart(user.id);
    const transformedCartItems: CartItemResponseDto[] = cart.cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      imageUrl: item.product.imageUrl,
      price: item.product.price,
      quantity: item.quantity,
    }))

    return transformedCartItems;
  }


  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateCart(
    @CurrentUser() user: User,
    @Body() items: UpdateCartItemDto[],
  ): Promise<CartItemResponseDto[]>{

    const cart = await this.cartService.updateCart(user.id, items);
    
    const transformedCartItems: CartItemResponseDto[] = cart.cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      imageUrl: item.product.imageUrl,
      price: item.product.price,
      quantity: item.quantity,
    }))

    return transformedCartItems;
  }

  
}
