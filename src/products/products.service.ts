import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { Product } from "src/entities/product.entity";
import { FirebaseProvider } from "src/storage/firebase/firebase";
import { Not, Repository } from "typeorm";
import { CategoriesService } from "src/categories/categories.service";
import { CreateProductDto, UpdateProductDto } from "src/dtos/product.dto";
import { Size } from "src/enums/size.enum";

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private readonly firebaseStorageProvider: FirebaseProvider,
    private readonly categoryService: CategoriesService,
  ) {}

  async findProducts(
    options: IPaginationOptions,
    categoryId?: string,
    sizes?: string[],
  ): Promise<Pagination<Product>> {
    const queryBuilder = this.productsRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category");

    if (categoryId) {
      queryBuilder.where("product.categoryId = :categoryId", { categoryId });
    }

    if (sizes && sizes.length > 0) {
      queryBuilder.andWhere("product.size IN (:...sizes)", { sizes });
    }

    queryBuilder.orderBy("product.createdAt", "DESC");

    return paginate<Product>(queryBuilder, options);
  }

  async findRelatedProduct(
    productId: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Product>> {
    const product = await this.findOne(productId);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return paginate<Product>(this.productsRepository, options, {
      where: {
        category: { id: product.category.id },
        id: Not(productId),
      },
      relations: ["category"],
    });
  }

  async findOne(id: string): Promise<Product | null> {
    return await this.productsRepository.findOne({
      where: { id },
      relations: ["category"],
    });
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

      const product = this.productsRepository.create({
        ...productData,
        imageUrl: url,
        category: category,
      });

      return this.productsRepository.save(product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException("Category not found");
      } else {
        this.logger.error("Error Creating Product", error);
        throw new InternalServerErrorException("Failed to create product");
      }
    }
  }

  async update(
    productId: string,
    file: Express.Multer.File,
    productData: UpdateProductDto,
  ): Promise<Product> {
    try {
      const existingProduct = await this.findOne(productId);

      if (!existingProduct) {
        throw new NotFoundException("Product not found");
      }

      if (file) {
        const { url } = await this.firebaseStorageProvider.update(
          existingProduct.imageUrl,
          file,
        );

        existingProduct.imageUrl = url;
      }

      const updatedProduct = Object.assign(existingProduct, productData);

      return await this.productsRepository.save(updatedProduct);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        this.logger.error("Error Creating Product", error);
        throw new InternalServerErrorException("Failed to update product");
      }
    }
  }

  async delete(id: string): Promise<void> {
    const result = await this.productsRepository.delete({ id });

    if (result.affected === 0) {
      throw new InternalServerErrorException(
        `Product with ID: ${id} not found`,
      );
    }
  }
}
