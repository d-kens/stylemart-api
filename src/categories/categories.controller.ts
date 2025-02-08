import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "../dtos/create-catgeoty.dto";
import { Category } from "src/entities/category.entity";
import { Roles } from "src/auth/decorators/roles.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { RoleEnum } from "src/enums/role.enum";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ApiTags, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller("categories")
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @ApiResponse({ status: 200, description: 'Successfully retrieved all categories.' })
  @ApiResponse({ status: 404, description: 'Categories not found.' })
  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @ApiParam({ name: 'id', required: true, description: 'Unique identifier of the category.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the category.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @Get(":id")
  async findOne(@Param("id") categoryId: string): Promise<Category> {
    return await this.categoriesService.findOne(categoryId);
  }

  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateCategoryDto }) 
  @ApiResponse({ status: 201, description: 'Category created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post()
  async create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto.name);
  }

  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', required: true, description: 'Unique identifier of the category to delete.' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @Delete(":id")
  async delete(@Param("id") categoryId: string) {
    return await this.categoriesService.delete(categoryId);
  }
}
