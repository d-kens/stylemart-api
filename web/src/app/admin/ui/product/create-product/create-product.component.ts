import { Component, inject, OnInit } from '@angular/core';
import { AdminProducService } from '../../../data-access/services/admin-product.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NewProduct, ProductCategory, sizes } from '../../../data-access/models/product.model';

@Component({
  selector: 'app-create-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent implements OnInit{

  categories: ProductCategory[] = [];
  loading: boolean = false; 
  error: boolean = false; 
  selectedFile: File | null = null;
  protected readonly sizes = sizes;

  private adminProductService = inject(AdminProducService);
  private toastr = inject(ToastrService);
  private router = inject(Router);


  createProductForm: FormGroup = new FormGroup({
    productName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    productBrand: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    productColor: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    productDescription: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    productPrice: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    productStock: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    productSize: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    productCategoryId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    productImage: new FormControl('', { nonNullable: true, validators: [Validators.required] }), // Keep for validation
  });

  get productName() {
    return this.createProductForm.get('productName');
  }

  get productBrand() {
    return this.createProductForm.get('productBrand');
  }

  get productColor() {
    return this.createProductForm.get('productColor');
  }

  get productDescription() {
    return this.createProductForm.get('productDescription');
  }

  get productPrice() {
    return this.createProductForm.get('productPrice');
  }

  get productStock() {
    return this.createProductForm.get('productStock');
  }

  get productSize() {
    return this.createProductForm.get('productSize');
  }

  get productCategoryId() {
    return this.createProductForm.get('productCategoryId');
  }

  get productImage() {
    return this.createProductForm.get('productImage');
  }

  


  ngOnInit(): void {
    this.fetchCategories()
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.productImage?.setValue(this.selectedFile.name);
    }
  }

  fetchCategories() {
    
    this.adminProductService.findAllCategories().subscribe({
      next: (categories: ProductCategory[]) => {
        this.categories = categories;
      },
      error: (error) => {
        this.toastr.error('Failed to fetch categories');
        this.error = true;
      }
    });
  }

  createProduct() {

    console.log("THIS HAPPENED")

    if (this.createProductForm.invalid) {
      this.createProductForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    console.log("CREATE PRODUCT REQUEST")

    const createProductRequest: NewProduct = {
      name: this.createProductForm.value.productName,
      brand: this.createProductForm.value.productBrand,
      color: this.createProductForm.value.productColor,
      description: this.createProductForm.value.productDescription,
      price: this.createProductForm.value.productPrice,
      stock: this.createProductForm.value.productStock,
      size: this.createProductForm.value.productSize,
      categoryId: this.createProductForm.value.productCategoryId,
      image: this.selectedFile!,
    }

    this.adminProductService.createProduct(createProductRequest).subscribe({
      next: () => {
        this.toastr.success('Product created successfully');
        this.loading = false;
        this.router.navigate(['admin/products/list']);
      },
      error: (error) => {
        this.toastr.error('Failed to create product');
        this.loading = false;
        console.log(error.message)
      }
    })
    


  }

  





}
