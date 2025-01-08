import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartService } from "src/cart/cart.service";
import { OrderItem } from "src/entities/order-item.entity";
import { Order } from "src/entities/order.entity";
import { User } from "src/entities/user.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private cartService: CartService,
    private readonly dataSource: DataSource
  ) {}

  async getAllOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId}},
      relations: ['orderItems'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems'],
    });
  
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }
  
    return order;
  }

  async createOrder(user: User): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const cart = await this.cartService.getCart(user.id);
  
      if (!cart || cart.cartItems.length === 0) {
        throw new BadRequestException("Cart is empty. Cannot place an order.");
      }
  
      for (const item of cart.cartItems) {
        if (item.product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product: ${item.product.name}`
          );
        }
      }
  
      const order = this.orderRepository.create({
        user,
        total: cart.cartItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),
      });
  
      const savedOrder = await queryRunner.manager.save(order);
  
      for (const item of cart.cartItems) {
        const orderItem = this.orderItemRepository.create({
          order: savedOrder,
          product: item.product,
          quantity: item.quantity,
          price: item.product.price,
        });
  
        await queryRunner.manager.save(orderItem);
  
        await queryRunner.manager.save(item.product);
      }
  
      cart.cartItems = [];
      await queryRunner.manager.update('Cart', { id: cart.id }, { cartItems: [] });
  
      await queryRunner.commitTransaction();
  
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(`Failed to create order for user ${user.id}`, error.stack);

      if (error instanceof BadRequestException) {
        throw error; 
      } else {
        throw new InternalServerErrorException();
      }
    
    } finally {
      await queryRunner.release();
    }
  }
  




  
}
