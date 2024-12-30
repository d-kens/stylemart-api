import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Product } from 'src/entities/product.entity';

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



  @Delete(':id')
  async delete(@Param('id') productId: string) {
    return await this.productsService.delete(productId);
  }
}
