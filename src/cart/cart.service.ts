import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartItem } from "src/entities/cart-item.entity";
import { Cart } from "src/entities/cart.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async createCart(userId: string) {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ["cartItems", "cartItems.product"],
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

  async updateCart(
    userId: string,
    items: { productId: string; quantity: number }[],
  ) {
    const cart = await this.createCart(userId);

    const productIds = items.map((item) => item.productId);

    // Find existing cart items for the provided product IDs
    const existingCartItems = await this.cartItemRepository.find({
      where: {
        product: { id: In(productIds) },
        cart: { id: cart.id },
      },
      relations: ["product"],
    });

    // create a Map for easy lookup of existing cart items by productId
    const existingCartItemsMap = new Map(
      existingCartItems.map((item) => [item.product.id, item]),
    );

    for (const { productId, quantity } of items) {
      if (existingCartItemsMap.has(productId)) {
        
        const existingCartItem = existingCartItemsMap.get(productId);
        existingCartItem.quantity = quantity;
        await this.cartItemRepository.save(existingCartItem);
        
      } else {
        
        const cartItem = this.cartItemRepository.create({
          product: { id: productId },
          cart,
          quantity: quantity,
        });

        await this.cartItemRepository.save(cartItem);
      }
    }
    
    return this.getCart(userId);
  }
}
