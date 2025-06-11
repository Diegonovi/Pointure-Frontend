import {
  Component,
  OnInit,
  NgZone,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CATEGORIES } from '../data/Categories';
import { COLORS } from '../data/Colors';
import { NgStyle } from '@angular/common';
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
      name: ['', Validators.required],
      description: ['', Validators.required],
      brand: ['', Validators.required],
      category: [null, Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(1)]],
    });
    this.cdr.detectChanges();
  }

  addImage(event: any) {
    if (this.imageFiles.length >= this.maxImages) return;

    const file = event.target.files[0];
    if (!file) return;

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
    if (this.productForm.invalid || this.imageFiles.length === 0) return;

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
      console.log('Product created successfully', product);
      this.productForm.reset();
      this.imagePreviews = [];
      this.imageFiles = [];
      this.router.navigate(['/products/', product.slug]);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        console.error('Unauthorized access - redirecting to login');
        this.flashMessageService.setMessage(
          'Su sesión ha expirado, por favor inicie sesión de nuevo'
        );
        this.authService.logout();
        this.router.navigate(['/login']);
      } else {
        console.error('Failed to create product', error);
      }
    }
  }
}
