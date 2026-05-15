import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () =>
      import('./features/shell/shell').then((m) => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home').then((m) => m.HomeComponent)
      },
      {
        path: 'bus',
        loadComponent: () =>
          import('./features/bus/bus').then((m) => m.BusComponent)
      },
      {
        path: 'route',
        loadComponent: () =>
          import('./features/route/route').then((m) => m.RouteComponent)
      },
      {
        path: 'tracking',
        loadComponent: () =>
          import('./features/tracking/tracking').then((m) => m.TrackingComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'home' }
];
