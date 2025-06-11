import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CATEGORIES } from '../data/Categories';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
  imports: [ReactiveFormsModule]
})
export class CreateProductComponent implements OnInit {
  productForm!: FormGroup;
  maxImages = 4;
  categories = CATEGORIES;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      category: [null, [Validators.required]],
      images: this.fb.array([], [Validators.required]),
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(1)]],
      colors: this.fb.array([]),
    });
  }

  get images() {
    return this.productForm.get('images') as FormArray;
  }

  addImage(event: any) {
    if (this.images.length < this.maxImages) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.ngZone.run(() => {
            this.images.push(this.fb.control(e.target.result));
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.images.removeAt(index);
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log('Form Data:', this.productForm.value);
    }
  }
}
