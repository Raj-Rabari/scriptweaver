import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    loadComponent: () => import('./auth/signup/signup').then((m) => m.Signup),
  },
  {
    path: 'c',
    canActivate: [authGuard],
    loadComponent: () => import('./app').then((m) => m.App),
  },
  { path: '', redirectTo: '/c', pathMatch: 'full' },
  { path: '**', redirectTo: '/c' },
];
