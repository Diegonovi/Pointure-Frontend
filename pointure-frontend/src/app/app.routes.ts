import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { LoginGuard } from './guards/login.guard';
import { CreateProductComponent } from './create-product/create-product.component';
import { CategoriesComponent } from './categories/categories.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, 
      { path: 'home', component: HomeComponent },
      {
        path: 'products/:slug',
        loadComponent: () =>
          import('./product-detail/product-detail.component').then(
            (m) => m.ProductDetailComponent
          ),
        data: {
          renderMode: 'client',
        },
      },
      {
        path: 'categories/:categoryName',
        loadComponent: () =>
          import('./category/category.component').then(
            (m) => m.CategoryComponent
          ),
        data: {
          renderMode: 'client',
        },
      },
      { path: 'categories', component: CategoriesComponent },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'search/:query',
        loadComponent: () =>
          import('./search/search.component').then((m) => m.SearchComponent),
        data: {
          renderMode: 'client',
        },
      },
      {
        path: 'dashboard',
        component: ProductManagementComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'product/create',
        component: CreateProductComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'products/update/:slug',
        loadComponent: () =>
          import('./edit-product/edit-product.component').then((m) => m.EditProductComponent),
        data: {
          renderMode: 'client',
        },
        canActivate: [LoginGuard],
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
