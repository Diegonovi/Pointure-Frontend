import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../services/products.service';
import { Product } from '../models/Product';
import { Page } from '../models/Page';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  firstRowProducts: Product[] = [];
  secondRowProducts: Product[] = [];
  thirdRowProducts: Product[] = [];
  pageNumber = 1;
  pageSize = 30;
  totalPages = 0;

  constructor(
    private productService: ProductService,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadProducts();
    this.cdRef.detectChanges();
  }

  async loadProducts(){
    let page: Page<Product> = await this.productService.getProducts(1, 10, '', 10);
    this.firstRowProducts = page.data;
    page = await this.productService.getProducts(1, 10, '', 20);
    this.secondRowProducts = page.data;
    page = await this.productService.getProducts(1, 10, '', 40);
    this.thirdRowProducts = page.data;
  }
}