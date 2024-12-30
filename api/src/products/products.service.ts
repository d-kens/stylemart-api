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
import { FirebaseProvider } from 'src/storage/firebase/firebase';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private categoriesRepository: Repository<Product>,
    private readonly firebaseStorageProvider: FirebaseProvider
  ) {}

  async findAll(options: IPaginationOptions): Promise<Pagination<Product>> {
    return paginate<Product>(this.categoriesRepository, options);
  }

  async findOne(id: string): Promise<Product | undefined> {
    return await this.categoriesRepository.findOne({ where: { id } });
  }

  async create(file: Express.Multer.File): Promise<any> {
    const imageUrl = await this.firebaseStorageProvider.upload(file);
    console.log("THE URL OF THE UPLOADED FILE IS HERE: ", imageUrl);
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
