import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ToyList } from './components/toy-list/toy-list';
import { ToyDetail } from './components/toy-detail/toy-detail';
import { Cart } from './components/cart/cart';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Profile } from './components/profile/profile';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'toys', component: ToyList },
  { path: 'toys/:permalink', component: ToyDetail },
  { path: 'cart', component: Cart },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile },
  { path: '**', redirectTo: '' }
];
