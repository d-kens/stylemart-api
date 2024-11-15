import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { unlink } from 'fs';
import { join } from 'path';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        private categoryService: CategoriesService,
    ) {}


    private async unlinkFile(filePath: string): Promise<void> {
        
    }


    async createProduct(productData: CreateProductDto, image: Express.Multer.File) {
        const category = await this.categoryService.findCategoryById(productData.categoryId);

        console.log(category)

        if (!category) {

            const filePath = join(process.cwd(), 'uploads/products/', image.filename);

            console.log(filePath)

            console.log('Invalid Category. Unlinking File');

            unlink(filePath, (err) => {
                if (err) {
                    console.error(err);
                }
            });
            throw new NotFoundException(`Category with id: ${productData.categoryId} not found`);
        }

        const product = new Product({
            ...productData,
            price: Number(productData.price),
            stock: Number(productData.stock),
        });

        return product;
    }

}
