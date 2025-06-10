import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { CATEGORIES } from '../data/Categories';

@Component({
  selector: 'app-category',
  standalone: true,
  // imports...
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit {
  category?: Category;
  products: Product[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const categoryRoute = params.get('categoryName');
      this.category = CATEGORIES.find(c => c.route === categoryRoute);
      
      if (this.category) {

        this.loadProducts(this.category.id);
      }
    });
  }

  private loadProducts(categoryId: number) {

  }
}