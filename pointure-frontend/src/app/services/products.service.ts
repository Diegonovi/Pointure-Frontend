import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Product } from '../models/Product';
import { Page } from '../models/Page';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = environment.baseUrl + environment.products;

  constructor(private http: HttpClient, private authService: AuthService) {}

  async getProducts(
    pageNumber: number = 1,
    pageSize: number = 30,
    name: string = '',
    categoryId?: number,
    colorIds: number[] = [],
    brandName: string = '',
    priceSortingDirection?: 'asc' | 'desc' | null,
    includeDeleted: boolean = false
  ): Promise<Page<Product>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('name', name)
      .set('brandName', brandName)
      .set('includeDeleted', includeDeleted.toString());

    if (categoryId !== undefined && categoryId !== null) {
      params = params.set('categoryId', categoryId.toString());
    }
    if (priceSortingDirection) {
      params = params.set('priceSortingDirection', priceSortingDirection);
    }
    if (colorIds.length) {
      params = params.set('colors', colorIds.join(',')); // Convert array to comma-separated values
    }

    try {
      return await firstValueFrom(
        this.http.get<Page<Product>>(`${this.baseUrl}/list`, { params })
      );
    } catch (error) {
      console.error('Failed to fetch products', error);
      return {
        data: [],
        totalItems: 0,
        pageSize: pageSize,
        pageNumber: pageNumber,
        totalPages: 0,
      };
    }
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      return await firstValueFrom(
        this.http.get<Product>(`${this.baseUrl}/${slug}`)
      );
    } catch (error) {
      console.error('Failed to fetch product', error);
      return null;
    }
  }

  async createProduct(formData: FormData): Promise<Product> {
    try {
      const token = this.authService.getToken();

      const headers = token
        ? new HttpHeaders({ Authorization: `Bearer ${token}` })
        : new HttpHeaders();

      return await firstValueFrom(
        this.http.post<Product>(`${this.baseUrl}/insert`, formData, { headers })
      );
    } catch (error) {
      console.error('Error creating product', error);
      throw error;
    }
  }

  async updateProduct(formData: FormData): Promise<Product> {
    try {
      const token = this.authService.getToken();

      const headers = token
        ? new HttpHeaders({ Authorization: `Bearer ${token}` })
        : new HttpHeaders();

      return await firstValueFrom(
        this.http.put<Product>(`${this.baseUrl}/update`, formData, { headers })
      );
    } catch (error) {
      console.error('Error updating product', error);
      throw error;
    }
  }
}