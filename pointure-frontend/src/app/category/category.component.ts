import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { CATEGORIES } from '../data/Categories';
import { ProductService } from '../services/products.service';
import { COLORS } from '../data/Colors';
import { NgStyle, NgIf, NgFor } from '@angular/common';
import { Page } from '../models/Page';

@Component({
  selector: 'app-category',
  standalone: true,
  templateUrl: './category.component.html',
  imports: [RouterLink, NgStyle, NgIf],
})
export class CategoryComponent implements OnInit {
  page: Page<Product> | null = null;
  products: Product[] = [];
  pageSize = 30;
  colors = COLORS;
  currentPage = 1;
  totalPages = 0;
  category!: Category;
  loading = false;

  filters = {
    name: '',
    brandName: '',
    colors: [] as number[],
    priceSortingDirection: null as 'asc' | 'desc' | null
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const routeName = this.route.snapshot.paramMap.get('categoryName');
    this.category = CATEGORIES.find((cat) => cat.route === routeName)!;

    if (!this.category) {
      console.error('Invalid category:', routeName);
      this.router.navigate(['/404']);
      return;
    }

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
        this.category.id,
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
