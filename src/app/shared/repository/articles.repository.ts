import { inject, Injectable } from '@angular/core';
import { Article, CreateArticlePayload, UpdateArticlePayload } from '@shared/api/articles';
import { ARTICLES_LS_KEY } from '@shared/constants';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { generateUuid } from '@shared/utils';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArticlesRepository {
  #localStorageService = inject(LocalStorageService);

  create(payload: CreateArticlePayload): Observable<Article> {
    const createdArticle = {
      id: generateUuid(),
      ...payload,
    };

    const lsArticles = this.#localStorageService.getItem<Article[]>(ARTICLES_LS_KEY) || [];

    lsArticles.push(createdArticle);

    this.#localStorageService.setItem(ARTICLES_LS_KEY, lsArticles);

    return of(createdArticle);
  }

  update(id: string, payload: UpdateArticlePayload): Observable<Article> {
    const lsArticles = this.#localStorageService.getItem<Article[]>(ARTICLES_LS_KEY) || [];
    const resultArticle = lsArticles.find((article) => article.id === id);

    if (!resultArticle) {
      return of();
    }

    const resultArticles = lsArticles.map((article) => {
      if (article.id !== id) {
        return article;
      }

      return {
        ...article,
        ...payload,
      };
    });

    this.#localStorageService.setItem(ARTICLES_LS_KEY, resultArticles);

    return of({
      ...resultArticle,
      ...payload,
    });
  }

  delete(id: string): Observable<string> {
    const lsArticles = this.#localStorageService.getItem<Article[]>(ARTICLES_LS_KEY) || [];
    const resultArticles = lsArticles.filter((article) => article.id !== id);

    this.#localStorageService.setItem(ARTICLES_LS_KEY, resultArticles);

    return of('Successfully deleted');
  }

  findOne(id: string): Observable<Article | null> {
    const lsArticles = this.#localStorageService.getItem<Article[]>(ARTICLES_LS_KEY) || [];
    const result = lsArticles.find((article) => article.id === id) || null;

    return of(result);
  }

  find(): Observable<Article[]> {
    return of(this.#localStorageService.getItem<Article[]>(ARTICLES_LS_KEY) || []);
  }
}
