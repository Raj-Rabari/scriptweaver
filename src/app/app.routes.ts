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
    loadComponent: () =>
      import('./conversations/chat-layout/chat-layout').then((m) => m.ChatLayout),
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('./conversations/conversation/conversation').then((m) => m.Conversation),
      },
    ],
  },
  { path: '', redirectTo: '/c', pathMatch: 'full' },
  { path: '**', redirectTo: '/c' },
];
