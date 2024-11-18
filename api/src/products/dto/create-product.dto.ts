import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty(
        { 
            description: 'The name of the product',
        }
    )
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ 
        description: 'The description of the product',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ 
        description: 'The price of the product',
    })
    @IsNotEmpty()
    @IsString()
    price: string

    @ApiProperty(
        { 
            description: 'The stock of the procduct',
        }
    )
    @IsNotEmpty()
    @IsString()
    stock: string;

    @ApiProperty({ 
        description: 'The categoryId of the product',
    })
    @IsNotEmpty()
    @IsString()
    categoryId: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    imageUrl?: string;
}