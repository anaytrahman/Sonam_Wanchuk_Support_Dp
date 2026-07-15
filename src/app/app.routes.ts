import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then(
        m => m.HomeComponent
      )
  },
  {
    path: 'crop',
    loadComponent: () =>
      import('./components/cropper/cropper.component').then(
        m => m.CropperComponent
      )
  },
  {
    path: 'preview',
    loadComponent: () =>
      import('./components/preview/preview.component').then(
        m => m.PreviewComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];