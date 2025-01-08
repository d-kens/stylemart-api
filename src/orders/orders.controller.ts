import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/entities/user.entity";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllOrders(@CurrentUser() user: User) {
    return await this.ordersService.getAllOrders(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrderById(@Param('id') orderId: string) {
    return await this.ordersService.getOrderById(orderId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@CurrentUser() user: User) {
    return await this.ordersService.createOrder(user);
  }
}
