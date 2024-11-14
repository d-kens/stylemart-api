import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import * as fs from 'fs';
import * as path from 'path';
import { diskStorage } from 'multer';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        private categoryService: CategoriesService,
    ) {}


    async createProduct(productData: CreateProductDto, image: Express.Multer.File): Promise<Product> {
        const category = this.categoryService.findCategoryById(productData.categoryId);


        const product = new Product(productData)

        try {
            return  await this.productsRepository.save(product);
        } catch (error) {
            throw new InternalServerErrorException('Failed to create product.')
        }
    }

}
