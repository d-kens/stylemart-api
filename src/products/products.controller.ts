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
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Pagination } from "nestjs-typeorm-paginate";
import { Product } from "src/entities/product.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateProductDto, PaginatedProducts, UpdateProductDto } from "src/dtos/product.dto";
import { Roles } from "src/auth/decorators/roles.decorator";
import { RoleEnum } from "src/enums/role.enum";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from "@nestjs/swagger";

@ApiTags('products')
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products', type: PaginatedProducts }) 
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit of products per page', type: Number, example: 10 })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID', type: String })
  @ApiQuery({ name: 'size', required: false, description: 'Filter by sizes', type: String })
  async findProducts(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("categoryId") categoryId?: string,
    @Query("size") size?: string,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;

    const sizes = size ? size.split(",").map((s) => s.trim()) : [];

    return this.productsService.findProducts(
      { page, limit },
      categoryId,
      sizes,
    );
  }

  @Get("related")
  @ApiResponse({ status: 200, description: 'List of products', type: PaginatedProducts }) 
  @ApiQuery({ name: 'productId', required: true, description: 'ID of the product to find related products for', type: String })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit of products per page', type: Number, example: 10 })
  async findRelatedProduct(
    @Query("productId") productId: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;

    return this.productsService.findRelatedProduct(productId, { page, limit });
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'The found product', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async findOne(@Param("id") productId: string): Promise<Product> {
    return await this.productsService.findOne(productId);
  }

  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: Product })
  @ApiResponse({ status: 400, description: 'File is required or validation errors.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(
    @UploadedFile() productImage: Express.Multer.File,
    @Body() productData: CreateProductDto,
  ): Promise<Product> {
    if (!productImage) {
      throw new HttpException("File is required", HttpStatus.BAD_REQUEST);
    }

    return await this.productsService.create(productImage, productData);
  }

  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Put(":id")
  @UseInterceptors(FileInterceptor("image"))
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiBody({ type: UpdateProductDto }) 
  @ApiResponse({ status: 201, description: 'Product created successfully', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async update(
    @Param("id") productId: string,
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
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete(":id")
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 200, description: 'Product successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async delete(@Param("id") productId: string) {
    return await this.productsService.delete(productId);
  }
}
