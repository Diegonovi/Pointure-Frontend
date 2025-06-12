import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgStyle, NgFor } from '@angular/common';
import { CATEGORIES } from '../data/Categories';
import { COLORS } from '../data/Colors';
import { ProductService } from '../services/products.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { FlashMessageService } from '../services/flashmessage.service';
import { Product } from '../models/Product';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle, NgFor],
})
export class EditProductComponent implements OnInit {
  productForm!: FormGroup;
  maxImages = 4;
  categories = CATEGORIES;
  colors = COLORS;

  imagePreviews: string[] = [];
  imageFiles: File[] = [];
  originalImages: string[] = [];
  deletedImages: string[] = [];

  selectedColors: number[] = [];
  productId!: string;
  isLoading = true;
  product: Product | null = null;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
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

    this.route.params.subscribe((params) => {
      this.productId = params['slug'];
      this.loadProductData();
    });
  }

  async loadProductData() {
    try {
      const product = await this.productService.getProductBySlug(
        this.productId
      );

      if (!product) {
        this.router.navigate(['/404']);
        return;
      }

      this.product = product;
      this.productForm.patchValue({
        name: product.name,
        description: product.description,
        brand: product.brandName,
        category: product.category,
        price: product.price,
        stock: product.stock,
      });

      this.originalImages = product.listingImages || [];
      this.imagePreviews = [...this.originalImages];
      this.selectedColors = product.colors || [];
      this.isLoading = false;

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading product:', error);
      this.flashMessageService.setMessage('Error loading product data');
      this.router.navigate(['/products']);
    }
  }

  addImage(event: any) {
    const file = event.target.files[0];
    const fileSizeError = document.getElementById('fileSizeError');

    if (!file) return;

    // 5MB
    const maxFileSize = 5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      if (fileSizeError) fileSizeError.style.display = 'block';
      event.target.value = '';
      return;
    } else {
      if (fileSizeError) fileSizeError.style.display = 'none';
    }

    if (
      this.imageFiles.length +
        this.imagePreviews.filter((img) => !this.originalImages.includes(img))
          .length >=
      this.maxImages
    )
      return;

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
    const image = this.imagePreviews[index];

    if (this.originalImages.includes(image)) {
      this.deletedImages.push(image);
    } else {
      const newImageIndex = this.imagePreviews
        .slice(0, index)
        .filter((img) => !this.originalImages.includes(img)).length;
      this.imageFiles.splice(newImageIndex, 1);
    }

    this.imagePreviews.splice(index, 1);
  }

  toggleColorFilter(colorId: number) {
    if (this.selectedColors.includes(colorId)) {
      this.selectedColors = this.selectedColors.filter((id) => id !== colorId);
    } else {
      this.selectedColors.push(colorId);
    }
  }

  async onSubmit() {
    if (this.imagePreviews.length === 0) {
      document.getElementById('imageError')!.style.display = 'block';
    } else {
      document.getElementById('imageError')!.style.display = 'none';
    }

    if (this.selectedColors.length === 0) {
      document.getElementById('colorError')!.style.display = 'block';
    } else {
      document.getElementById('colorError')!.style.display = 'none';
    }

    if (
      this.productForm.invalid ||
      this.imagePreviews.length === 0 ||
      this.selectedColors.length === 0
    ) {
      return;
    }

    const formData = new FormData();
    const formValue = this.productForm.value;

    formData.append('id', this.product!.id);
    formData.append('slug', this.product!.slug);
    formData.append('name', formValue.name);
    formData.append('description', formValue.description);
    formData.append('brand', formValue.brand);
    formData.append('category', formValue.category.toString());
    formData.append('price', formValue.price.toString());
    formData.append('stock', formValue.stock.toString());

    this.selectedColors.forEach((colorId: number) => {
      formData.append('colors', colorId.toString());
    });

    this.deletedImages.forEach((imageName: string) => {
      formData.append('deletedImages', imageName);
    });

    console.log(this.deletedImages);

    this.imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const updatedProduct = await this.productService.updateProduct(formData);
      this.flashMessageService.setMessage('Producto actualizado correctamente');
      this.router.navigate(['/products', updatedProduct.slug]);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        this.flashMessageService.setMessage(
          'Su sesión ha expirado, por favor inicie sesión de nuevo'
        );
        this.authService.logout();
        this.router.navigate(['/login']);
      } else {
        console.error('Error updating product:', error);
        this.flashMessageService.setMessage('Error updating product');
      }
    }
  }
}
