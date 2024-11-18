import { Product } from "src/entities/product.entity";
import { ApiProperty } from "@nestjs/swagger";

export class ProductResponseDto {
    @ApiProperty()
    id: string
    @ApiProperty()
    name: string;
    @ApiProperty()
    price: number;
    @ApiProperty()
    description: string;
    @ApiProperty()
    categoryId: string;
    @ApiProperty()
    imageUrl: string;
    @ApiProperty()
    createdDate: Date;
    @ApiProperty()
    updatedDate: Date;
    @ApiProperty()
    stock: number;

    constructor(product: Product) {
        this.id = product.id;
        this.name = product.name;
        this.price = product.price;
        this.description = product.description;
        this.categoryId = product.categoryId;
        this.imageUrl = product.imageUrl;
        this.createdDate = product.createdAt;
        this.updatedDate = product.updatedAt;
        this.stock = product.stock;
    }
}