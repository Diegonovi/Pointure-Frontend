import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgStyle } from '@angular/common';
import { CATEGORIES } from '../data/Categories';
import { COLORS } from '../data/Colors';
import { ProductService } from '../services/products.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { FlashMessageService } from '../services/flashmessage.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle],
})
export class CreateProductComponent implements OnInit {
  productForm!: FormGroup;
  maxImages = 4;
  categories = CATEGORIES;
  colors = COLORS;

  imagePreviews: string[] = [];
  imageFiles: File[] = [];

  selectedColors: number[] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private router: Router,
    private authService: AuthService,
    private flashMessageService: FlashMessageService
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(2000),
        ],
      ],
      brand: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      category: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stock: [null, [Validators.required, Validators.min(1)]],
    });

    this.cdr.detectChanges();
  }

  addImage(event: any) {
    if (
      this.imageFiles.length + (this.imagePreviews?.length || 0) >=
      this.maxImages
    )
      return;

    const file = event.target.files[0];
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024);
    const fileSizeError = document.getElementById('fileSizeError');

    if (fileSizeMB > 5) {
      if (fileSizeError) fileSizeError.style.display = 'block';
      return;
    } else {
      if (fileSizeError) fileSizeError.style.display = 'none';
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviews.push(e.target.result);
      this.imageFiles.push(file);
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);

    event.target.value = '';
  }

  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
    this.imageFiles.splice(index, 1);
  }

  toggleColorFilter(colorId: number) {
    if (this.selectedColors.includes(colorId)) {
      this.selectedColors = this.selectedColors.filter((id) => id !== colorId);
    } else {
      this.selectedColors.push(colorId);
    }
  }

  async onSubmit() {
    if (this.imageFiles.length == 0)
      document.getElementById('imageError')!.style.display = 'block';
    else document.getElementById('imageError')!.style.display = 'none';
    if (this.selectedColors.length == 0)
      document.getElementById('colorError')!.style.display = 'block';
    else document.getElementById('colorError')!.style.display = 'none';
    if (
      this.productForm.invalid ||
      this.imageFiles.length === 0 ||
      this.selectedColors.length === 0
    )
      return;

    const formData = new FormData();
    const formValue = this.productForm.value;

    formData.append('name', formValue.name);
    formData.append('description', formValue.description);
    formData.append('brand', formValue.brand);
    formData.append('category', formValue.category.toString());
    formData.append('price', formValue.price.toString());
    formData.append('stock', formValue.stock.toString());

    this.selectedColors.forEach((colorId: number) => {
      formData.append('colors', colorId.toString());
    });

    this.imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const product = await this.productService.createProduct(formData);
      this.productForm.reset();
      this.imagePreviews = [];
      this.imageFiles = [];
      this.selectedColors = [];
      this.flashMessageService.setMessage(
        'Producto creado exitosamente'
      );
      this.router.navigate(['/products', product.slug]);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        this.flashMessageService.setMessage(
          'Su sesión ha expirado, por favor inicie sesión de nuevo'
        );
        this.authService.logout();
        this.router.navigate(['/login']);
      } else {
        console.error('Error al crear el producto:', error);
      }
    }
  }
}
