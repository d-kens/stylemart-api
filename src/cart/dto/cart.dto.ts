import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsPositive,
  IsArray,
  ValidateNested,
} from "class-validator";

export class CartItemDto {
  productId: string;
  name: string;
  price: number;
  brand: string;
  imageUrl: string;
  quantity: number;

  constructor(cartItem: any) {
    this.productId = cartItem.product.id;
    this.name = cartItem.product.name;
    this.price = cartItem.product.price;
    this.brand = cartItem.product.brand;
    this.imageUrl = cartItem.product.imageUrl;
    this.quantity = cartItem.quantity;
  }
}

export class CartDto {
  items: CartItemDto[]; 
  
  constructor(cartItems: any[]) {
    this.items = cartItems.map((cartItem) => new CartItemDto(cartItem));
  }
}

export class UpdateCartItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsPositive()
  quantity: number;
}

export class UpdateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCartItemDto)
  items: UpdateCartItemDto[];
}
