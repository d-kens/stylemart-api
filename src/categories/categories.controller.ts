import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from '../dtos/create-catgeoty.dto';
import { Category } from 'src/entities/category.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RoleEnum } from 'src/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @Get('id')
  async findOne(@Param('id') categoryId: string): Promise<Category> {
    return await this.categoriesService.findOne(categoryId);
  }

  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto.name);
  }

  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') categoryId: string) {
    return await this.categoriesService.delete(categoryId);
  }
}
