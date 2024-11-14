import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    price: number

    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @IsNotEmpty()
    @IsString()
    categoryId: string

    @IsOptional()
    @IsString()
    imageUrl?: string;
}