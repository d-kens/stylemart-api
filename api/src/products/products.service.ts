import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Product } from 'src/entities/product.entity';
import { FirebaseProvider } from 'src/storage/firebase/firebase';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private categoriesRepository: Repository<Product>,
    private readonly firebaseStorageProvider: FirebaseProvider,
    private readonly categoryService: CategoriesService,
  ) {}

  async findAll(options: IPaginationOptions): Promise<Pagination<Product>> {
    return paginate<Product>(this.categoriesRepository, options);
  }

  async findOne(id: string): Promise<Product | undefined> {
    return await this.categoriesRepository.findOne({ where: { id } });
  }

  async create(
    file: Express.Multer.File,
    productData: CreateProductDto,
  ): Promise<Product> {
    try {
      const { url } = await this.firebaseStorageProvider.upload(file);

      const category = await this.categoryService.findOne(
        productData.categoryId,
      );

      if (!category) {
        throw new NotFoundException();
      }

      const product = this.categoriesRepository.create({
        ...productData,
        imageUrl: url,
        category: category,
      });

      return this.categoriesRepository.save(product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Category not found');
      }
    }
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
