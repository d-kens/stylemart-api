import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CartItemDto {
    @IsNotEmpty()
    @IsString()
    productId: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}