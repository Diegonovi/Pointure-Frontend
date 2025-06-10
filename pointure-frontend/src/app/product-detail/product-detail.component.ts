import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../services/products.service';
import { Product } from '../models/Product';

@Component({
  selector: 'app-product-detail.component',
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})

export class ProductDetailComponent implements OnInit {
   product: Product | null = null;
  notFound = false;

  selectedImage : string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdRef: ChangeDetectorRef
  ) {}

  public products: Product[] = [];

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      await this.loadProduct(slug);
    } else {
      this.router.navigate(['/404']);
    }
    this.cdRef.detectChanges();
  }

  async loadProduct(slug: string) {
    this.product = await this.productService.getProductBySlug(slug);
    if (!this.product) {
      this.router.navigate(['/404']);
    } else {
      this.selectedImage = this.product.listingImages[0];
      await this.loadSimilarProducts();
    }
  }

  async loadSimilarProducts() {
    if (this.product) {
      this.products = (await this.productService.getProducts(1, 10, '', this.product.category)).data;
      this.products = this.products.filter(p => p.id !== this.product!.id);
    }
  }
}
