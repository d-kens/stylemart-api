import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/entities/category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find();
  }

  async findOne(categoryId: string): Promise<Category> {
    return await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });
  }

  async create(name: string): Promise<Category> {
    const existingCategory = await this.categoriesRepository.findOne({
      where: { name },
    });

    if (existingCategory) {
      throw new ConflictException("Category already exists");
    }

    try {
      const newCategory = this.categoriesRepository.create({ name });
      return await this.categoriesRepository.save(newCategory);
    } catch (error) {
      this.logger.error("Error Creating Category", error);
      throw new InternalServerErrorException("Could not create category");
    }
  }

  async delete(id: string): Promise<void> {
    const result = await this.categoriesRepository.delete({ id });

    if (result.affected === 0) {
      throw new InternalServerErrorException(
        `Category with ID: ${id} not found`,
      );
    }
  }
}
