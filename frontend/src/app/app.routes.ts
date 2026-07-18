import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
    title: 'UNLOST - Smart Lost and Found'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Login - UNLOST'
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent),
    title: 'Register - UNLOST'
  },
  {
    path: 'report-lost',
    loadComponent: () => import('./pages/report-item/report-item.component').then(m => m.ReportItemComponent),
    data: { type: 'lost' },
    title: 'Report Lost Item - UNLOST'
  },
  {
    path: 'report-found',
    loadComponent: () => import('./pages/report-item/report-item.component').then(m => m.ReportItemComponent),
    data: { type: 'found' },
    title: 'Report Found Item - UNLOST'
  },
  {
    path: 'items',
    loadComponent: () => import('./pages/browse-items/browse-items.component').then(m => m.BrowseItemsComponent),
    title: 'Browse Items - UNLOST'
  },
  {
    path: 'items/:id',
    loadComponent: () => import('./pages/item-detail/item-detail.component').then(m => m.ItemDetailComponent),
    title: 'Item Detail - UNLOST'
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    title: 'My Profile - UNLOST'
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    title: 'Admin Dashboard - UNLOST'
  }
];
