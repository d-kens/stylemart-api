import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/entities/user.entity";
import { Order } from "src/entities/order.entity";

@ApiTags("orders")
@ApiBearerAuth()
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Retrieve all orders for the current user" })
  @ApiResponse({ status: 200, description: "List of orders", type: [Order] }) 
  @ApiResponse({ status: 401, description: "Unauthorized" }) 
  async findAll(@CurrentUser() user: User): Promise<Order[]> {
    return this.ordersService.findAll(user.id);
  }

  @Get(":orderId")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Retrieve a specific order by ID" })
  @ApiResponse({ status: 200, description: "The requested order", type: Order }) 
  @ApiResponse({ status: 404, description: "Order not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" }) 
  async findOne(@Param("orderId") orderId: string): Promise<Order> {
    return this.ordersService.findOne(orderId);
  }

  @Post() 
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create a new order for the current user" })
  @ApiResponse({ status: 201, description: "Order created successfully", type: Order }) 
  @ApiResponse({ status: 401, description: "Unauthorized" }) 
  async createOrder(@CurrentUser() user: User): Promise<Order> {
    return await this.ordersService.createOrder(user.id);
  }
}
