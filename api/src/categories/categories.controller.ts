import { CategoriesService } from './categories.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
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

    @ApiOperation({ summary: 'Retrieve a single category'})
    @ApiOkResponse({
        description: 'Category retrieved successfully',
        type: CategoryResponseDto
    })
    @ApiNotFoundResponse({ description: 'Category not found',})
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
        const category = await this.categoriesService.findCategoryById(id);
        return new CategoryResponseDto(category);
    }

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

    @ApiOperation({ summary: 'Update Category'})
    @ApiCreatedResponse({ 
        description: 'Category has been successfully updated.',
        type: CategoryResponseDto
    })
    @ApiForbiddenResponse({ description: 'Forbidden.'})
    @ApiNotFoundResponse({ description: 'Category to be updated not found',})
    @Put(':id')
    async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
        const updatedCategory = await this.categoriesService.updateCategory(id, updateCategoryDto);
        return new CategoryResponseDto(updatedCategory);
    }

    @ApiOperation({ summary: 'Delete a category' }) 
    @ApiNoContentResponse({ description: 'Category deleted successfully' })
    @ApiForbiddenResponse({ description: 'Forbidden.'})
    @ApiNotFoundResponse({ description: 'Category to be deleted not found',})
    @Delete(':id')
    async deleteCategory(@Param('id') id: string): Promise<void> {
        return this.categoriesService.deleteCategory(id);
    }
}
