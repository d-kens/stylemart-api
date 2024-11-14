import { Product } from "src/entities/product.entity";

export class ProductResponseDto {
    id: string
    name: string;
    price: number;
    description: string;
    categoryId: string;
    imageUrl: string;
    createdDate: Date;
    updatedDate: Date;
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