import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { CartService } from "./cart.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { User } from "src/entities/user.entity";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { CartDto, UpdateCartDto } from "./dto/cart.dto";

@Controller("cart")
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCart(@CurrentUser() user: User): Promise<CartDto> {
    const cart = await this.cartService.getCart(user.id);
    return new CartDto(cart.cartItems);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateCart(
    @CurrentUser() user: User,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<CartDto> {
    const cart = await this.cartService.updateCart(
      user.id,
      updateCartDto.items,
    );
    return new CartDto(cart.cartItems);
  }
}
