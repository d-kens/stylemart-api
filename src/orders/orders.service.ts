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
            // Create order items
            const orderItems = products.map(productData => {
                return queryRunner.manager.create(OrderItem, {
                    price: productData.price,
                    quantity: productData.quantity,
                    product: { id: productData.productId }, // Assuming product is referenced by its ID
                });
            });
    
            // Create the order with order items
            const order = queryRunner.manager.create(Order, {
                total: totalPrice,
                user: { id: userId },
                orderItems: orderItems, // Include order items here
            });
    
            // Log the order before saving
            this.logger.debug('Saving order:', order);
            const savedOrder = await queryRunner.manager.save(Order, order);
    
            // If you need to save order items separately, you can do so.
            // For example, you could save them if you want to handle them differently
            for (const orderItem of orderItems) {
                orderItem.order = savedOrder; // Link each order item to the saved order
                // Log the order item before saving
                this.logger.debug('Saving order item:', orderItem);
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
