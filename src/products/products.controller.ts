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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Product } from 'src/entities/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto, UpdateProductDto } from 'src/dtos/product.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @Get()
  async findProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('categoryId') categoryId?: string,
    @Query('size') size?: string,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;

    const sizes = size ? size.split(',').map(s => s.trim()) : [];

    return this.productsService.findProducts({ page, limit }, categoryId, sizes,);
  }





  @Get('related')
  async findRelatedProduct(
    @Query('productId') productId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<Product>>{
    limit = limit > 100 ? 100 : limit;

    return this.productsService.findRelatedProduct(productId, { page, limit })

  }

  @Get(':id')
  async findOne(@Param('id') productId: string): Promise<Product> {
    return await this.productsService.findOne(productId);
  }

  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
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

  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
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

  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') productId: string) {
    return await this.productsService.delete(productId);
  }

}
