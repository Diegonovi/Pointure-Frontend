import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../services/products.service';
import { Product } from '../models/Product';
import { Page } from '../models/Page';
import { COLORS } from '../data/Colors';
import { CATEGORIES } from '../data/Categories';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  imports: [RouterLink, NgStyle, NgIf, NgFor, FormsModule]
})
export class SearchComponent implements OnInit {
  page: Page<Product> | null = null;
  products: Product[] = [];
  pageSize = 30;
  categories = CATEGORIES;
  colors = COLORS;
  currentPage = 1;
  totalPages = 0;
  loading = false;

  filters = {
    name: '',
    brandName: '',
    colors: [] as number[],
    categoryId: null as number | null,
    priceSortingDirection: null as 'asc' | 'desc' | null
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.filters.name = this.route.snapshot.paramMap.get('query') || '';

    await this.fetchProducts();
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
      this.totalPages = this.page.totalPages;
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

  updatePriceSorting(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filters.priceSortingDirection = select.value as 'asc' | 'desc';
    this.applyFilters(); // apply immediately on sort
  }
}

