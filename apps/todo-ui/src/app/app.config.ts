import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { Routes, provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiInterceptor } from '../api.interceptor';
import { provideServiceWorker } from '@angular/service-worker';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./todos/view-all/view-all.component'),
  },
  {
    path: 'todos/editor',
    loadComponent: () => import('./todos/editor/editor.component'),
  },
  {
    path: 'todos/editor/:id',
    loadComponent: () => import('./todos/editor/editor.component'),
  },
  {
    path: 'todos/:id',
    loadComponent: () => import('./todos/view-item/view-item.component'),
  },
  {
    path: 'todos',
    loadComponent: () => import('./todos/view-all/view-all.component'),
  },
  {
    path: 'todos/hashtag/:hashtag',
    loadComponent: () => import('./todos/view-all/view-all.component'),
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([ApiInterceptor])),
    importProvidersFrom(BrowserAnimationsModule),
    provideServiceWorker('ngsw-worker.js', {
      enabled: true,
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
