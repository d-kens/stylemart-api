import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Product } from 'src/entities/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create( @UploadedFile() image: Express.Multer.File,) {
    if (!image) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }
    return await this.productsService.create(image);
  }

  @Get(':id')
  async findOne(@Param('id') productId: string): Promise<Product> {
    return await this.productsService.findOne(productId);
  }

  @Delete(':id')
  async delete(@Param('id') productId: string) {
    return await this.productsService.delete(productId);
  }
}
