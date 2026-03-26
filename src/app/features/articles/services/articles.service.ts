import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Article, ArticlesApiService } from '@shared/api/articles';
import { LoadingState } from '@shared/constants';

@Injectable()
export class ArticlesService {
  #articlesApiService = inject(ArticlesApiService);
  #destroyRef = inject(DestroyRef);

  articles = signal<Article[] | null>(null);
  loadingState = signal<LoadingState>(LoadingState.initial);

  loadArticles(): void {
    this.loadingState.set(LoadingState.loading);

    this.#articlesApiService
      .getArticles()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (response) => {
          this.articles.set(response);
          this.loadingState.set(LoadingState.loaded);
        },
        error: () => {
          this.loadingState.set(LoadingState.failed);
        },
      });
  }

  deleteArticle(...args: Parameters<ArticlesApiService['deleteArticle']>): void {
    this.#articlesApiService
      .deleteArticle(...args)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.loadArticles();
        },
      });
  }
}
