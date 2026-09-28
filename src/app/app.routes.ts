import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home), title: 'Geenie Travels — Dream Abroad' },
  { path: 'canada', loadComponent: () => import('./pages/canada/canada').then((m) => m.CanadaPage), title: 'Canada · Geenie Travels' },
  { path: 'cities/:slug', loadComponent: () => import('./pages/city/city').then((m) => m.CityPage) },
  { path: 'programs', loadComponent: () => import('./pages/programs/programs').then((m) => m.ProgramsPage), title: 'Programs · Geenie Travels' },
  { path: 'visas-funds', loadComponent: () => import('./pages/visas/visas').then((m) => m.VisasPage), title: 'Visas & Funds · Geenie Travels' },
  { path: 'make-a-wish', loadComponent: () => import('./pages/contact/contact').then((m) => m.ContactPage), title: 'Make a Wish · Geenie Travels' },
  { path: '**', redirectTo: '' },
];
