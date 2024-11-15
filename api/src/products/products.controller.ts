import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';


@Controller('products')
export class ProductsController {
    constructor(
        private productsService: ProductsService
    ){}

    @Get()
    async getAllProducts(): Promise<ProductResponseDto[]> {
        const products = await this.productsService.getAllProducts();
        return products.map(product => new ProductResponseDto(product));
    }

    @Get(':id')
    async getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
        const product = await this.productsService.getProductById(id);
        return new ProductResponseDto(product);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/products',
            filename: (req, file, callback) => {
                const name: string = file.originalname.split('.')[0];
                const fileExtension: string = file.originalname.split('.')[1];
                const newFileName: string = name.split(" ").join("_")+"_"+Date.now()+"."+fileExtension;

                callback(null, newFileName);
            }
        }),
        fileFilter: (req, file, callback) => {
            if(!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                return callback(
                    new BadRequestException('Unsupported file format. Only JPEG, PNG, GIF and JPG are allowed.'), false
                )
            }

            callback(null, true)
        }
    }))
    async createProduct(@UploadedFile() file: Express.Multer.File, @Body() productData: CreateProductDto): Promise<ProductResponseDto> {
        const result = await this.productsService.createProduct(productData, file);
        return new ProductResponseDto(result);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string): Promise<void> {
        await this.productsService.deleteProduct(id);
    }

    @Get('image/:filename')
    async getProductImage(@Param('filename') filename, @Res() res: Response): Promise<void> {
        res.sendFile( filename, {root: './uploads/products',});
    }

}
