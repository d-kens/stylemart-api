import { Component, inject, OnInit } from '@angular/core';
import { AdminProducService } from '../../../data-access/services/admin-product.service';
import { ToastrService } from 'ngx-toastr';
import { Product, ProductPagination } from '../../../data-access/models/product.model';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent implements OnInit {

  products: Product[] = [];
  loading: boolean = false; 
  error: boolean = false;

  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;
  
  private adminProductService = inject(AdminProducService);
  private toastr = inject(ToastrService);


  ngOnInit(): void {
      this.fetchProducts(this.currentPage, this.itemsPerPage);
  }


  fetchProducts(page: number, limit: number) {
    this.loading = true;

    this.adminProductService.findAllProducts(page, limit).subscribe({
      next: (response: ProductPagination) => {
        this.products = response.items;
        this.currentPage = response.meta.currentPage;
        this.itemsPerPage = response.meta.itemsPerPage;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to fetch products');
        this.error = true;
        this.loading = false;
      }
    })
  }

  deleteProduct(productId: string) {
    this.adminProductService.deleteProduct(productId).subscribe({
      next: () => {
        this.toastr.success('Product deleted successfully');
        this.fetchProducts(this.currentPage, this.itemsPerPage);
      },
      error: (error) => {
        this.toastr.error('Failed to delete product');
      }
    });
  }

  onPageChange(page: number): void {
    this.fetchProducts(page, this.itemsPerPage);
  }

}
