import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartService } from "src/cart/cart.service";
import { Cart } from "src/entities/cart.entity";
import { OrderItem } from "src/entities/order-item.entity";
import { Order } from "src/entities/order.entity";
import { User } from "src/entities/user.entity";
import { OrderStatus } from "src/enums/order-status.enum";
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


  async findAll(userId: string): Promise<Order[]> {
    try {
      const orders = await this.orderRepository.find({
        where: { user: { id: userId } },

      });

      if (!orders || orders.length === 0) {
        throw new NotFoundException(`No orders found for user with ID ${userId}.`);
      }

      return orders;
    } catch (error) {
      this.logger.error(`Error fetching orders for user ${userId}: ${error.message}`);
      throw new InternalServerErrorException("Failed to retrieve orders.");
    }
  }


  async findOne(orderId: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['orderItems'],
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found.`);
      }

      return order;
    } catch (error) {
      this.logger.error(`Error fetching order ${orderId}`);
      throw new InternalServerErrorException("Failed to retrieve order.");
    }
  }
  


  async createOrder(userId: string): Promise<Order> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();


    try {
      const cart = await this.validateCartItems(userId);


      // Create an order
      const order = queryRunner.manager.create(Order, {
        user: { id: userId },
        total: cart.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        orderStatus: OrderStatus.PENDING
      });

      console.log(order)
      const savedOrder = await queryRunner.manager.save(order);

      // Create Order Items and Update Inventory
      for (const cartItem of cart.cartItems ) {
        const orderItem = queryRunner.manager.create(OrderItem, {
          product: { id: cartItem.product.id },
          quantity: cartItem.quantity,
          price: cartItem.product.price,
          order: savedOrder,
        });

        this.logger.log(`Order Item being created: ${JSON.stringify(orderItem)}`);
        await queryRunner.manager.save(orderItem);
        
  
        const product = cartItem.product;
        product.stock -= cartItem.quantity;
        await queryRunner.manager.save(product);
      }

      // Delete the cart items from the database
      for (const cartItem of cart.cartItems) {
        await queryRunner.manager.delete("CartItem", cartItem.id);
      }

      // Clear the cart
      cart.cartItems = [];
      await queryRunner.manager.save(cart);

      await queryRunner.commitTransaction();
      return savedOrder;

    } catch (error) {
      this.logger.error(`Error creating order: ${error.message}`);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException("Failed to create order.");
    } finally {
      await queryRunner.release();
    }

  }




  private async validateCartItems(userId: string): Promise<Cart> {
    const cart = await this.cartService.getCart(userId);

    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException("Cart is empty. Cannot proceed with order.");
    }

    for (const cartItem of cart.cartItems) {
      const product = cartItem.product;

      if (!product) {
        throw new NotFoundException(`Product with ID ${cartItem.product.id} not found.`);
      }

      if (product.stock < cartItem.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product "${product.name}". Available stock: ${product.stock}, requested: ${cartItem.quantity}.`
        );
      }
    }

    return cart;
  }
  




  
}
