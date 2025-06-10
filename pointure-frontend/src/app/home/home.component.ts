import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../services/products.service';
import { Product } from '../models/Product';
import { Page } from '../models/Page';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  pageNumber = 1;
  pageSize = 30;
  totalPages = 0;

  constructor(private productService: ProductService, private cdRef: ChangeDetectorRef) { }

  async ngOnInit(): Promise<void> {
    this.products = (await this.productService.getProducts(1, 10, '', 10)).data;
    this.cdRef.detectChanges();
  }

  loadProducts(): void {
    this.productService.getProducts(this.pageNumber, this.pageSize).then((page: Page<Product>) => {
      this.products = page.data;
      this.totalPages = page.totalPages;
    }).catch(error => {
      console.error("Failed to load products", error);
    });
  }

}