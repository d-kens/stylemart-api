import { ApiProperty } from '@nestjs/swagger';

export class CartItemResponseDto {
    @ApiProperty({ description: 'The unique identifier of the product' })
    id: string;

    @ApiProperty({ description: 'The name of the product' })
    name: string;

    @ApiProperty({ description: 'The URL of the product image' })
    imageUrl: string;

    @ApiProperty({ description: 'The price of the product' })
    price: number;

    @ApiProperty({ description: 'The quantity of the product in the cart' })
    quantity: number;
}

export class UpdateCartItemDto {
    @ApiProperty({ description: 'The unique identifier of the product' })
    id: string;

    @ApiProperty({ description: 'The new quantity of the product in the cart' })
    quantity: number;
}
