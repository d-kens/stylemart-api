import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/entities/user.entity";
import { Order } from "src/entities/order.entity";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: User): Promise<Order[]> {
    return this.ordersService.findAll(user.id);
  }

  @Get(":orderId")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("orderId") orderId: string): Promise<Order> {
    return this.ordersService.findOne(orderId);
  }


  @Post() 
  @UseGuards(JwtAuthGuard)
  async createOrder(@CurrentUser() user: User) {
    return await this.ordersService.createOrder(user.id);
  }
}
