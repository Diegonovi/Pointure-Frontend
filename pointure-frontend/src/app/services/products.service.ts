import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Product } from '../models/Product';
import { Page } from '../models/Page';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = environment.baseUrl + environment.products;

  constructor(private http: HttpClient) {}

  async getProducts(
    pageNumber: number = 1,
    pageSize: number = 30,
    name: string = '',
    categoryId?: number,
    brandName: string = '',
    priceSortingDirection?: 'asc' | 'desc' | null
  ): Promise<Page<Product>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('name', name)
      .set('brandName', brandName);

    if (categoryId !== undefined && categoryId !== null) {
      params = params.set('categoryId', categoryId.toString());
    }
    if (priceSortingDirection) {
      params = params.set('priceSortingDirection', priceSortingDirection);
    }

    try {
      return await firstValueFrom(this.http.get<Page<Product>>(`${this.baseUrl}/list`, { params }));
    } catch (error) {
      console.error("Failed to fetch products", error);
      return { data: [], totalItems: 0 , pageSize: pageSize, pageNumber: pageNumber, totalPages: 0};
    }
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      return await firstValueFrom(this.http.get<Product>(`${this.baseUrl}/${slug}`));
    } catch (error) {
      console.error("Failed to fetch product", error);
      return null;
    }
  }
}

