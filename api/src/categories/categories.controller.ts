import { CategoriesService } from './categories.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

@Controller('categories')
export class CategoriesController {
    constructor(
        private categoriesService: CategoriesService
    ) {}

    @Get()
    findAll(): Promise<CategoryResponseDto[]> {
        return this.categoriesService.findAllCategroies()
    }

    @Post()
    async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
        const result = await this.categoriesService.createCategory(createCategoryDto);
        return result;
    }
}
