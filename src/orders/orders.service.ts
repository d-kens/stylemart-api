import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
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

        try {

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

            const order = this.orderRepository.create({
                total: totalPrice,
                user: { id: userId },
            })


            await this.orderRepository.save(order);
            return products;

        } catch (err) {
            this.logger.error(`Error retrieving cart details: ${err.message}`);
            throw new InternalServerErrorException('Error retrieving cart details');
        }

    }
    
    
}
