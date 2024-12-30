import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-catgeoty.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @Post()
  async create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto.name);
  }

  @Delete(':id')
  async delete(@Param('id') categoryId: string) {
    return await this.categoriesService.delete(categoryId);
  }
}
