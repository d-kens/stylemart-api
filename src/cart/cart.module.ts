import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartItem } from "src/entities/cart-item.entity";
import { Cart } from "src/entities/cart.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
