import { CategoriesService } from './categories.service';
import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleEnum } from 'src/enums/role.enum';

@ApiTags('category endpoints')
@ApiResponse({ status: 500, description: 'Internal server error.' })
@Controller('categories')
export class CategoriesController {
    constructor(
        private categoriesService: CategoriesService
    ) {}

    @Get()
    @ApiOperation({ summary: 'Retrieve all categories' })
    @ApiOkResponse({
        description: 'List of categories retrieved successfully',
        type: [CategoryResponseDto]
    })
    async findAll(): Promise<CategoryResponseDto[]> {
        const categories = await this.categoriesService.findAllCategories();
        console.log(categories)
        return categories.map((category) => new CategoryResponseDto(category));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a single category'})
    @ApiOkResponse({
        description: 'Category retrieved successfully',
        type: CategoryResponseDto
    })
    @ApiNotFoundResponse({ description: 'Category not found',})
    async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
        const category = await this.categoriesService.findCategoryById(id);

        if(!category) throw new NotFoundException(`Category with id: ${id} not found`);
        
        return new CategoryResponseDto(category);
    }

    @Roles(RoleEnum.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create category'})
    @ApiCreatedResponse({ 
        description: 'Category has been successfully created.',
        type: CategoryResponseDto
    })
    @ApiBadRequestResponse({ description: 'Validation failed. Check the request body for required fields and correct data types.',})
    @ApiNotFoundResponse({ description: 'Parent category not found' })
    @ApiForbiddenResponse({ description: 'Forbidden.'})
    async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
        const createdCategory = await this.categoriesService.createCategory(createCategoryDto);
        return new CategoryResponseDto(createdCategory);
    }

    @Roles(RoleEnum.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Update Category'})
    @ApiCreatedResponse({ 
        description: 'Category has been successfully updated.',
        type: CategoryResponseDto
    })
    @ApiForbiddenResponse({ description: 'Forbidden.'})
    @ApiNotFoundResponse({ description: 'Category to be updated not found',})
    async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
        const updatedCategory = await this.categoriesService.updateCategory(id, updateCategoryDto);
        return new CategoryResponseDto(updatedCategory);
    }

    @Roles(RoleEnum.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a category' }) 
    @ApiNoContentResponse({ description: 'Category deleted successfully' })
    @ApiForbiddenResponse({ description: 'Forbidden.'})
    @ApiNotFoundResponse({ description: 'Category to be deleted not found',})
    async deleteCategory(@Param('id') id: string): Promise<void> {
        return this.categoriesService.deleteCategory(id);
    }
}
