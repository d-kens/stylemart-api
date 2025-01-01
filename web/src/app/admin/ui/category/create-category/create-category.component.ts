import { Component, inject } from '@angular/core';
import { AdminProducService } from '../../../data-access/services/admin-product.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductCategory } from '../../../data-access/models/product.model';


@Component({
  selector: 'app-create-category',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.scss'
})
export class CreateCategoryComponent {

  loading = false;

  private adminProductService = inject(AdminProducService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  createCategoryForm: FormGroup = new FormGroup({
    categoryName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  get categoryName() {
    return this.createCategoryForm.get('name');
  }

  createCategory() {
    if (this.createCategoryForm.invalid) {
      this.createCategoryForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    
    const createCategoryRequest: ProductCategory = {
      name: this.createCategoryForm.value.categoryName,
    }

    console.log(createCategoryRequest)

    this.adminProductService.createCategory(createCategoryRequest).subscribe({
      next: (response) => {
        this.toastr.success('Category created successfully');
        this.loading = false;
        this.router.navigate(['admin/categories/list']);
      },
      error: (error) => {
        this.toastr.error('Failed to create category');
        this.loading = false;
        console.log(error.message)
      }
    })
  }


}
