import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CartService } from "./cart.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { User } from "src/entities/user.entity";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { CartItemResponseDto, UpdateCartItemDto } from "./dto/cart.dto";

@ApiTags("cart")
@ApiBearerAuth()
@Controller("cart/items")
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: "Get cart items for the current user" })
  @ApiResponse({ status: 200, description: "List of cart items", type: [CartItemResponseDto] })
  @ApiResponse({ status: 401, description: "Unauthorized" }) 
  async getCart(@CurrentUser() user: User): Promise<CartItemResponseDto[]> {
    const cart = await this.cartService.getCart(user.id);
    const transformedCartItems: CartItemResponseDto[] = cart.cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      imageUrl: item.product.imageUrl,
      price: item.product.price,
      quantity: item.quantity,
    }));

    return transformedCartItems;
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({ summary: "Update cart items for the current user" })
  @ApiBody({
    description: 'Array of cart items to update',
    type: [UpdateCartItemDto], 
  })
  @ApiResponse({ status: 200, description: "Updated cart items", type: [CartItemResponseDto] })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" }) 
  async updateCart(
    @CurrentUser() user: User,
    @Body() items: UpdateCartItemDto[],
  ): Promise<CartItemResponseDto[]> {
    const cart = await this.cartService.updateCart(user.id, items);
    
    const transformedCartItems: CartItemResponseDto[] = cart.cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      imageUrl: item.product.imageUrl,
      price: item.product.price,
      quantity: item.quantity,
    }));

    return transformedCartItems;
  }
}









































