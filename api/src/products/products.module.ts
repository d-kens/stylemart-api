import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { FirebaseProvider } from 'src/storage/firebase/firebase';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductsService, FirebaseProvider],
  controllers: [ProductsController],
})
export class ProductsModule {}
