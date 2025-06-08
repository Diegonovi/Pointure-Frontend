import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: '', component: HomeComponent }],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
