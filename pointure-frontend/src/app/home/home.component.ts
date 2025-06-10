import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/products.service';
import { Product } from '../models/Product';
import { Page } from '../models/Page';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  pageNumber = 1;
  pageSize = 30;
  totalPages = 0;

  constructor(private productService: ProductService) { }

   ngOnInit(): void {
    this.productService.getProducts(1, 5, '', 10).subscribe({
      next: (page) => {
        this.products = page.data;
        console.log('Products loaded:', this.products);
      },
      error: (err) => console.error('Failed to load products', err),
    });
  }

  loadProducts(): void {
    this.productService.getProducts(this.pageNumber, this.pageSize).subscribe({
      next: (page: Page<Product>) => {
        this.products = page.data;
        this.totalPages = page.totalPages;
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

}