import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartItem } from "src/entities/cart-item.entity";
import { Cart } from "src/entities/cart.entity";
import { In, Repository } from "typeorm";
import { UpdateCartItemDto } from "./dto/cart.dto";

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async createCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ["cartItems", "cartItems.product", "cartItems.product.category"],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user: { id: userId },
        cartItems: [],
      });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  async getCart(userId: string): Promise<Cart> {
    return await this.createCart(userId);
  }


  async updateCart(userId: string, items: UpdateCartItemDto[]): Promise<Cart> {
    const cart = await this.createCart(userId); 

    for (const updateItem of items) {
      const cartItem = await this.cartItemRepository.findOne({
        where: { product: { id: updateItem.id }, cart: { id: cart.id } },
        relations: ["product"], 
      });

      if (cartItem) {
        cartItem.quantity = updateItem.quantity;
        await this.cartItemRepository.save(cartItem);
      } else {
        const newCartItem = this.cartItemRepository.create({
          product: { id: updateItem.id },
          quantity: updateItem.quantity,
          cart: cart,
        });
        await this.cartItemRepository.save(newCartItem);
        this.logger.log(`Added new product with id ${updateItem.id} to the cart.`);
      }
    }

    return await this.getCart(userId);
  }
}


  

 

