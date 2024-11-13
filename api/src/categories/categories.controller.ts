import { CategoriesService } from './categories.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(
        private categoriesService: CategoriesService
    ) {}

    @Get()
    findAll(): Promise<CategoryResponseDto[]> {
        return this.categoriesService.findAllCategroies()
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
        return this.categoriesService.findCategoryById(id);
    }

    @Post()
    async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
        const result = await this.categoriesService.createCategory(createCategoryDto);
        return result;
    }

    @Put(':id')
    async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
        return this.categoriesService.updateCategory(id, updateCategoryDto);
    }

    @Delete(':id')
    async deleteCategory(@Param('id') id: string) {
        return this.categoriesService.deleteCategory(id);
    }
}
