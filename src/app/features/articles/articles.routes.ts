import { Routes } from '@angular/router';

export const articlesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/articles/articles.page').then((m) => m.ArticlesPage),
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/article/article.page').then((m) => m.ArticlePage),
    data: {
      editMode: true,
    },
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/article/article.page').then((m) => m.ArticlePage),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/article/article.page').then((m) => m.ArticlePage),
    data: {
      editMode: true,
    },
  },
];
