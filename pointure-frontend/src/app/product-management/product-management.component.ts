import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../services/products.service';
import { Product } from '../models/Product';
import { Page } from '../models/Page';
import { COLORS } from '../data/Colors';
import { CATEGORIES } from '../data/Categories';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlashMessageService } from '../services/flashmessage.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  templateUrl: './product-management.component.html',
  imports: [RouterLink, NgStyle, NgIf, FormsModule],
})
export class ProductManagementComponent implements OnInit {
  page: Page<Product> | null = null;
  products: Product[] = [];
  pageSize = 30;
  categories = CATEGORIES;
  colors = COLORS;
  currentPage = 1;
  totalPages = 0;
  loading = false;
  successMessage: string | null = null;

  filters = {
    name: '',
    brandName: '',
    colors: [] as number[],
    categoryId: null as number | null,
    priceSortingDirection: null as 'asc' | 'desc' | null,
  };

  constructor(
    private router: Router,
    private productService: ProductService,
    private cdRef: ChangeDetectorRef,
    private flashMessageService: FlashMessageService
  ) {}

  async ngOnInit() {
    await this.fetchProducts();
    this.successMessage = this.flashMessageService.getMessage();
    this.cdRef.detectChanges();
  }

  async fetchProducts() {
    this.loading = true;
    try {
      this.page = await this.productService.getProducts(
        this.currentPage,
        this.pageSize,
        this.filters.name,
        this.filters.categoryId ? this.filters.categoryId : undefined,
        this.filters.colors,
        this.filters.brandName,
        this.filters.priceSortingDirection,
        false
      );
      this.products = this.page.data;
      this.totalPages = this.page.totalPages == 0 ? 1 : this.page.totalPages;
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      this.loading = false;
      this.cdRef.detectChanges();
    }
  }

  updateCategory(newCategoryCode: number | null) {
    this.filters.categoryId = newCategoryCode;
  }

  async applyFilters() {
    this.currentPage = 1;
    await this.fetchProducts();
    this.cdRef.detectChanges();
  }

  changePage(newPage: number) {
    this.currentPage = newPage;
    this.fetchProducts();
  }

  toggleColorFilter(colorId: number) {
    if (this.filters.colors.includes(colorId)) {
      this.filters.colors = this.filters.colors.filter((id) => id !== colorId);
    } else {
      this.filters.colors.push(colorId);
    }
  }

  updateBrandName(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filters.brandName = input.value;
  }

  updateName(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filters.name = input.value;
  }

  updatePriceSorting(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filters.priceSortingDirection = select.value as 'asc' | 'desc';
    this.applyFilters();
  }
}
