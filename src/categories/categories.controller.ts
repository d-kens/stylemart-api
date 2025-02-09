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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "../dtos/create-catgeoty.dto";
import { Category } from "src/entities/category.entity";
import { Roles } from "src/auth/decorators/roles.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { RoleEnum } from "src/enums/role.enum";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @ApiOperation({ summary: "Retrieve all categories" })
  @ApiResponse({ status: 200, description: "Returns a list of categories", type: [Category] })
  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @ApiOperation({ summary: "Retrieve a single category by ID" })
  @ApiParam({ name: "id", type: String, description: "Category ID" })
  @ApiResponse({ status: 200, description: "Returns the requested category", type: Category })
  @ApiResponse({ status: 404, description: "Category not found" })
  @Get(":id")
  async findOne(@Param("id") categoryId: string): Promise<Category> {
    return await this.categoriesService.findOne(categoryId);
  }

  @ApiOperation({ summary: "Create a new category (Admin only)" })
  @ApiBody({ type: CreateCategoryDto, description: "Category data" })
  @ApiResponse({ status: 201, description: "Category created successfully", type: Category })
  @ApiResponse({ status: 400, description: "Invalid request data" })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post()
  async create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto.name);
  }

  @ApiOperation({ summary: "Delete a category by ID (Admin only)" })
  @ApiParam({ name: "id", type: String, description: "Category ID" })
  @ApiResponse({ status: 200, description: "Category deleted successfully" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id") categoryId: string): Promise<{ message: string }> {
    await this.categoriesService.delete(categoryId);
    return { message: "Category deleted successfully" };
  }
}
