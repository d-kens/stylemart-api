export interface CartItemResponseDto {
    id: string;
    name: string;        
    imageUrl: string;    
    price: number;       
    quantity: number;   
}

export interface UpdateCartItemDto {
    id: string;
    quantity: number;
}