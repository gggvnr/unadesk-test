import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'articles',
    loadChildren: () => import('./features/articles/articles.routes').then((m) => m.articlesRoutes),
  },
  { path: '**', redirectTo: 'articles' },
];
