export type ProductSizes = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export const sizes: ProductSizes[] = [ 'XS', 'S', 'M', 'L', 'XL', 'XXL' ]


export interface ProductCategory {
    id?: string,
    name?: string;
}

export interface BaseProduct {
    brand: string;
    color: string;
    size: ProductSizes;
    stock: number;
    name: string;
    price: number;
    description: string;
}

export interface Product extends BaseProduct {
    id?: string;
    category: ProductCategory;
}

export interface NewProduct extends BaseProduct {
    categoryId: string;
    image: File; 
}

export interface ProductPagination {
    items: Product[],
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    }
}




