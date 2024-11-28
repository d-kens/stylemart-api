export class CartResponseDto {
    id: string;
    total: number;
    cartItems: CartItemResponseDto[];

    constructor(cart: any) {
        this.id = cart.id;
        this.total = cart.total;
        this.cartItems = cart.cartItems.map(item => new CartItemResponseDto(item));
    }
}

export class CartItemResponseDto {
    id: string;
    quantity: number;
    productId: string; 
    productQuantity: number; 
    imageUrl: string; 

    constructor(item: any) {
        this.id = item.id;
        this.quantity = item.quantity;
        this.productId = item.product.id; 
        this.productQuantity = item.product.stock; 
        this.imageUrl = item.product.imageUrl; 
    }
}