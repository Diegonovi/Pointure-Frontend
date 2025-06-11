import { Component, OnInit, NgZone, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CATEGORIES } from '../data/Categories';
import { COLORS } from '../data/Colors';
import { NgStyle } from '@angular/common';

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

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      brand: ['', Validators.required],
      category: [null, Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(1)]],
      colors: this.fb.array([]),
    });

    
  }

  addImage(event: any) {
    if (this.imagePreviews.length >= this.maxImages) return;

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviews.push(e.target.result);
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);

    event.target.value = '';
  }

  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log('Form:', this.productForm.value);
      console.log('Images:', this.imagePreviews);
    }
  }

  toggleColorSelection(colorId: number) {
    const selectedColors: number[] = this.productForm.get('colors')?.value || [];

    if (selectedColors.includes(colorId)) {
      this.productForm.patchValue({
        colors: selectedColors.filter((id) => id !== colorId),
      });
    } else {
      this.productForm.patchValue({
        colors: [...selectedColors, colorId],
      });
    }
  }
}
