import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/entities/order-item.entity';
import { Order } from 'src/entities/order.entity';
import { ProductsService } from 'src/products/products.service';
import { DataSource, Repository } from 'typeorm';

interface ProductDetails {
    productName: string;
    price: number;
    brand: string;
    imageUrl: string;
    quantity: number;
    productId: string;
}

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        private productService: ProductsService,
        private dataSource: DataSource,
    ) {}

    async getCartDetails(productIds: string[], userId: string): Promise<ProductDetails[]> {
        const products: ProductDetails[] = [];
        let totalPrice = 0;

        for (const productId of productIds) {
            const product = await this.productService.findOne(productId);
            
            if (product) {
                const productData: ProductDetails = {
                    productName: product.name,
                    price: product.price,
                    brand: product.brand,
                    imageUrl: product.imageUrl,
                    quantity: 1,
                    productId: product.id,
                };
    
                products.push(productData);
                totalPrice += product.price; 
            }
        }

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();

        await queryRunner.startTransaction();

        try {
            const order = queryRunner.manager.create(Order, {
                total: totalPrice,
                user: { id: userId },
            });
            const savedOrder = await queryRunner.manager.save(Order, order);

            for (const productData of products) {
                const orderItem = queryRunner.manager.create(OrderItem, {
                    price: productData.price,
                    quantity: productData.quantity,
                    product: { id: productData.productId },
                    order: savedOrder,
                });

                await queryRunner.manager.save(OrderItem, orderItem);
            }

            await queryRunner.commitTransaction();
            return products;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Transaction failed: ', err);
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
