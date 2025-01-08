import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "src/entities/order.entity";
import { OrderItem } from "src/entities/order-item.entity";
import { CartModule } from "src/cart/cart.module";

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), CartModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
