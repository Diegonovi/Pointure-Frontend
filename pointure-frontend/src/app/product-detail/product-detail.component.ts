import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../services/products.service';
import { Product } from '../models/Product';
import { FlashMessageService } from '../services/flashmessage.service';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-detail.component',
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  notFound = false;

  showDeleteModal = false;
  selectedImage: string = '';
  successMessage: string | null = null;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdRef: ChangeDetectorRef,
    private flashMessageService: FlashMessageService,
    private authService: AuthService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.successMessage = this.flashMessageService.getMessage();
  }

  public products: Product[] = [];

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      await this.loadProduct(slug);
    } else {
      this.router.navigate(['/404']);
    }
    this.isLoggedIn = this.authService.isLoggedIn();
    this.cdRef.detectChanges();
  }

  async loadProduct(slug: string) {
    this.product = await this.productService.getProductBySlug(slug);
    if (!this.product || this.product.isDeleted) {
      this.router.navigate(['/404']);
    } else {
      this.selectedImage = this.product.listingImages[0];
      await this.loadSimilarProducts();
    }
  }

  async loadSimilarProducts() {
    if (this.product) {
      this.products = (
        await this.productService.getProducts(1, 10, '', this.product.category)
      ).data;
      this.products = this.products.filter((p) => p.id !== this.product!.id);
    }
  }

  async deleteProduct() {
    if (!this.product) return;

    try {
      await this.productService.deleteProduct(this.product.id);
      this.flashMessageService.setMessage('Producto eliminado correctamente');
      this.router.navigate(['/dashboard']);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        this.flashMessageService.setMessage(
          'Su sesión ha expirado, por favor inicie sesión de nuevo'
        );
        this.authService.logout();
        this.router.navigate(['/login']);
      } else {
        console.error('Error updating product:', error);
        this.flashMessageService.setMessage('Error updating product');
      }
    }
  }
}
