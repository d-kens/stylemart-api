import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductCategory } from '../../../data-access/models/product.model';
import { AdminProducService } from '../../../data-access/services/admin-product.service';

@Component({
  selector: 'app-admin-categories',
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.scss'
})
export class AdminCategoriesComponent implements OnInit {

  categories: ProductCategory[] = [];
  loading: boolean = false; 
  error: boolean = false; 


  private adminProductService = inject(AdminProducService);
  private toastr = inject(ToastrService);


  ngOnInit(): void {
    this.fetchCategories()
  }

  fetchCategories() {

    this.loading = true;

    this.adminProductService.findAllCategories().subscribe({
      next: (categories: ProductCategory[]) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to fetch categories');
        this.error = true;
        this.loading = false;
      }
    });
  }


  deleteCategory(categoryId: string) {
    this.adminProductService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.toastr.success('Category deleted successfully');
        this.fetchCategories();
      },
      error: (error) => {
        this.toastr.error('Failed to delete category');
      }
    });
  }

}
