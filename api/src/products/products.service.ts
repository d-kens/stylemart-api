import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { unlink } from 'fs';
import { join } from 'path';
import * as process from 'process';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        private categoryService: CategoriesService,
    ) {}

    async getAllProducts(): Promise<Product[]> {
        return this.productsRepository.find();
    }

    async getProductById(productId: string): Promise<Product> {
        return await this.productsRepository.findOne({
            where: { id: productId }
        });
    }

    async createProduct(productData: CreateProductDto, image: Express.Multer.File): Promise<Product> {
        const category = await this.categoryService.findCategoryById(productData.categoryId);

        productData.imageUrl = `${process.env.BASE_URL}/products/image/${image.filename}`

        if (!category) {
            await this.unlinkFile(productData.imageUrl)
            throw new NotFoundException(`Category with id: ${productData.categoryId} not found`);
        }

        try {

            const product = new Product({
                ...productData,
                price: Number(productData.price),
                stock: Number(productData.stock),
            });
    
            return await this.productsRepository.save(product);
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException('Failed to create product')
        }
    }

    /**
     * TODO: Implement product update operation
     */

    async deleteProduct(productId: string): Promise<void> {

        const product = await this.getProductById(productId);
        
        if (!product) {
            throw new NotFoundException(`Product with id: ${productId} not found`);
        }

        try {
            await this.unlinkFile(product.imageUrl)

            await this.productsRepository.delete(product);

        } catch (error) {
            throw new InternalServerErrorException('Failed to delete product')
        }
    }

    private async unlinkFile(imageUrl: string): Promise<void> {
        const filename = imageUrl.split('/').pop();

        const filePath = join(process.cwd(), 'uploads/products/', filename);

        unlink(filePath, (err) => {
            if (err) {
               throw err;
            }
        });
    }

}
