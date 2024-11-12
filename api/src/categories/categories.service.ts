import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>
    ) {}

    async findAllCategroies(): Promise<CategoryResponseDto[]> {
        const categories = await this.categoriesRepository.find();

        return categories.map((category) => new CategoryResponseDto(category))
    }

    async findCategoryById(categoryId: string): Promise<CategoryResponseDto> {
        const category = await this.categoriesRepository.findOne({
            where: { id: categoryId }
        });

        if(!category) throw new NotFoundException('Category not Found');

        return new CategoryResponseDto(category);
    }


    async createCategory(newCategoryData: CreateCategoryDto): Promise<CategoryResponseDto> {
        // category data
        const { name, description, parentCategoryId } = newCategoryData;

        let parentCategory = null;

        if (parentCategoryId) {
            parentCategory = await this.findCategoryById(parentCategoryId);
        }

        try {
            const newCategory = new Category({
                name,
                description,
                parentCategory
            });
    
            const result =  await this.categoriesRepository.save(newCategory);

            return new CategoryResponseDto(result);
        
        } catch (error) {
            throw new InternalServerErrorException("Failed to create category. Try again later");
        }
    }
}
