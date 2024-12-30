import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private categoriesRepository: Repository<Product>,
  ) {}

  async findAll(options: IPaginationOptions): Promise<Pagination<Product>> {
    return paginate<Product>(this.categoriesRepository, options);
  }

  async findOne(id: string): Promise<Product | undefined> {
    return await this.categoriesRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    const result = await this.categoriesRepository.delete({ id });

    if (result.affected === 0) {
      throw new InternalServerErrorException(
        `Product with ID: ${id} not found`,
      );
    }
  }
}
