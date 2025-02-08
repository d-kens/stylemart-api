import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer"; 
import { Size } from "src/enums/size.enum";
import { PartialType } from "@nestjs/mapped-types";
import { Pagination } from 'nestjs-typeorm-paginate';
import { Product } from "src/entities/product.entity";

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product', example: 'Sample Product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The price of the product', example: 99.99 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;

  @ApiProperty({ description: 'A description of the product', example: 'This is a sample product description.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The brand of the product', example: 'Sample Brand' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ description: 'The size of the product', enum: Size })
  @IsNotEmpty()
  @IsEnum(Size)
  size: Size;

  @ApiProperty({ description: 'The color of the product', example: 'Red' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ description: 'The stock quantity of the product', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  stock: number;

  @ApiProperty({ description: 'The category ID of the product', example: 'category-uuid' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ required: false, description: 'Name of the product' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, description: 'Price of the product' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false, description: 'Description of the product' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, description: 'Brand of the product' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ required: false, description: 'Size of the product', enum: Size })
  @IsEnum(Size)
  @IsOptional()
  size?: Size;

  @ApiProperty({ required: false, description: 'Color of the product' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ required: false, description: 'Stock of the product' })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({ required: false, description: 'ID of the category' })
  @IsString()
  @IsOptional()
  categoryId?: string;
}


export class PaginatedProducts {
  @ApiProperty({ type: [Product] })
  items: Product[];

  @ApiProperty()
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
