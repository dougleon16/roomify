import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Home - Roomify',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'visualizer/:id',
    title: 'Visualizer - Roomify',
    loadComponent: () => import('./pages/visualizer/visualizer').then((m) => m.Visualizer),
  },
];
