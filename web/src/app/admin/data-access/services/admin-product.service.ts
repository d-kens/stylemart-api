import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { NewProduct, Product, ProductCategory, ProductPagination } from "../models/product.model";
import { environment } from "../../../../environments/environment.development";
import { Observable } from "rxjs";


const categoryBaseUrl = environment.categories.baseUrl;
const productBaseUrl = environment.products.baseUrl;

@Injectable({
    providedIn: 'root'
})
export class AdminProducService {

    http = inject(HttpClient)

    findAllCategories(): Observable<ProductCategory[]> {
        return this.http.get<ProductCategory[]>(`${categoryBaseUrl}`)
    }

    createCategory(category: ProductCategory): Observable<ProductCategory> {
        return this.http.post<ProductCategory>(`${categoryBaseUrl}`, category)
    }

    deleteCategory(categoryId: string): Observable<any> {
        return this.http.delete(`${categoryBaseUrl}/${categoryId}`)
    }


    findAllProducts(page: number = 1, limit: number = 10): Observable<ProductPagination> {
        const params = new HttpParams()
          .set('page', page.toString())
          .set('limit', limit.toString());
    
        return this.http.get<ProductPagination>(`${productBaseUrl}`, { params });
      }

    createProduct(product: NewProduct): Observable<Product> {
        const formData = new FormData();
        formData.append('image', product.image);
        formData.append('brand', product.brand);
        formData.append('color', product.color);
        formData.append('size', product.size);
        formData.append('stock', product.stock.toString());
        formData.append('name', product.name);
        formData.append('price', product.price.toString());
        formData.append('description', product.description);
        formData.append('categoryId', product.categoryId);

        return this.http.post<Product>(`${productBaseUrl}`, formData)
    }

    deleteProduct(productId: string): Observable<any> {
        return this.http.delete(`${productBaseUrl}/${productId}`) 
    }

}