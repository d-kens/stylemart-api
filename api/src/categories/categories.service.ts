import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>
    ) {}

    async findAllCategories(): Promise<Category[]> {
        return await this.categoriesRepository.find({
            relations: ['parentCategory'],
        });
        
    }

    async findCategoryById(categoryId: string): Promise<Category> {
        const category = await this.categoriesRepository.findOne({
            where: { id: categoryId },
            relations: ['parentCategory'],
        });

        return category;
    }


    async createCategory(newCategoryData: CreateCategoryDto): Promise<Category> {
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
    
            return await this.categoriesRepository.save(newCategory);
        
        } catch (error) {
            throw new InternalServerErrorException("Failed to create category. Try again later");
        }
    }

    async updateCategory(categoryId: string, updateCategoryData: UpdateCategoryDto): Promise<Category> {
        const existingCategory = await this.findCategoryById(categoryId);

        if(!existingCategory) throw new NotFoundException(`Category with id: ${categoryId} not found`);

        const { 
            name = existingCategory.name, 
            description = existingCategory.description, 
            parentCategoryId
        } = updateCategoryData;

        if (parentCategoryId && parentCategoryId === categoryId) {
            throw new BadRequestException("A category cannot be its own parent.");
        }

        let parentCategory = null;
        if (parentCategoryId) {
            parentCategory = await this.findCategoryById(updateCategoryData.parentCategoryId);
        }

        try {

            const updatedCategory = Object.assign(existingCategory, {
                name,
                description,
                parentCategory
            });

            return await this.categoriesRepository.save(updatedCategory);

        } catch (error) {
            throw new InternalServerErrorException('Failed to update category');
        }

    }

    async deleteCategory(categoryId: string): Promise<void> {
        const result = await this.categoriesRepository.delete({
            id: categoryId
        });

        if(result.affected === 0) throw new NotFoundException(`Category with ID: ${categoryId} not found`);
    }

}
