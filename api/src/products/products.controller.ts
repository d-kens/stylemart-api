import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Product } from 'src/entities/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto, UpdateProductDto } from 'src/dtos/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;

    return this.productsService.findAll({
      page,
      limit,
    });
  }

  @Get(':id')
  async findOne(@Param('id') productId: string): Promise<Product> {
    return await this.productsService.findOne(productId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() productImage: Express.Multer.File,
    @Body() productData: CreateProductDto,
  ): Promise<Product> {
    if (!productImage) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    return await this.productsService.create(productImage, productData);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') productId: string,
    @UploadedFile() productImage: Express.Multer.File,
    @Body() productData: UpdateProductDto,
  ): Promise<Product> {
    return await this.productsService.update(
      productId,
      productImage,
      productData,
    );
  }

  @Delete(':id')
  async delete(@Param('id') productId: string) {
    return await this.productsService.delete(productId);
  }
}
