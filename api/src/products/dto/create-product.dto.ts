import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    price: string

    @IsNotEmpty()
    @IsString()
    stock: string;

    @IsNotEmpty()
    @IsString()
    categoryId: string

    @IsOptional()
    @IsString()
    imageUrl?: string;
}