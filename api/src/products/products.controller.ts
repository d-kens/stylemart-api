import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


/**
 * Specify query parameters
 */
@ApiTags('product endpoints ')
@ApiResponse({ status: 500, description: 'Internal server error.' })
@Controller('products')
export class ProductsController {
    constructor(
        private productsService: ProductsService
    ){}

    @Get()
    @ApiOperation({ summary: 'Retrieve all products' })
    @ApiOkResponse({
        description: 'List of products retrieved successfully',
        type: [ProductResponseDto]
    })
    async getAllProducts(): Promise<ProductResponseDto[]> {
        const products = await this.productsService.getAllProducts();
        return products.map(product => new ProductResponseDto(product));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a single product'})
    @ApiOkResponse({
        description: 'Product retrieved successfully',
        type: ProductResponseDto
    })
    @ApiNotFoundResponse({ description: 'Product not found',})
    async getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
        const product = await this.productsService.getProductById(id);
        if(!product) throw new NotFoundException(`Product with id: ${id} not found`)
        return new ProductResponseDto(product);
    }

    @Get('image/:filename')
    @ApiOperation({
        summary: 'Retrieve product image',
        description: 'Fetches the product image based on the filename provided.'
    })
    @ApiOkResponse({
        description: 'Product image retrieved successfully',
        content: {
            'image/png': {
                schema: {
                    type: 'string',
                    format: 'binary'
                }
            },
            'image/jpeg': {
                schema: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    async getProductImage(@Param('filename') filename, @Res() res: Response): Promise<void> {
        res.sendFile( filename, {root: './uploads/products',});
    }

    @Roles(RoleEnum.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create product'})
    @ApiCreatedResponse({ 
        description: 'Product has been successfully created.',
        type: ProductResponseDto
    })
    @ApiBadRequestResponse({ description: 'Validation failed. Check the request body for required fields and correct data types.',})
    @ApiNotFoundResponse({ description: 'Category not found' })
    @ApiForbiddenResponse({ description: 'Forbidden.'})
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
        const createdProduct = await this.productsService.createProduct(productData, file);
        return new ProductResponseDto(createdProduct);
    }

    @Roles(RoleEnum.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Update product'})
    @ApiCreatedResponse({ 
        description: 'Product has been successfully updated.',
        type: ProductResponseDto
    })
    @ApiForbiddenResponse({ description: 'Forbidden.'})
    @ApiNotFoundResponse({ description: 'Product to be updated not found',})
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
    async updateProduct(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() productData: UpdateProductDto): Promise<ProductResponseDto> {
        const updatedProduct = await this.productsService.updateProduct(id, productData, file);
        return new ProductResponseDto(updatedProduct);
    }

    @Roles(RoleEnum.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a product' }) 
    @ApiNoContentResponse({ description: 'Product deleted successfully' })
    @ApiForbiddenResponse({ description: 'Forbidden.'})
    @ApiNotFoundResponse({ description: 'Product to be deleted not found',})
    async deleteProduct(@Param('id') id: string): Promise<void> {
        await this.productsService.deleteProduct(id);
    }

}
