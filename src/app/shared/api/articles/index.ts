import { inject, Injectable } from '@angular/core';
import { ArticlesRepository } from '@shared/repository/articles.repository';
import { Observable } from 'rxjs';
import { Article, CreateArticlePayload, UpdateArticlePayload } from './types';

@Injectable({ providedIn: 'root' })
export class ArticlesApiService {
  #repository = inject(ArticlesRepository);

  createArticle(payload: CreateArticlePayload): Observable<Article> {
    return this.#repository.create(payload);
  }

  updateArticle(id: string, payload: UpdateArticlePayload): Observable<Article> {
    return this.#repository.update(id, payload);
  }

  deleteArticle(id: string): Observable<string> {
    return this.#repository.delete(id);
  }

  getArticles(): Observable<Article[]> {
    return this.#repository.find();
  }

  getArticleById(id: string): Observable<Article | null> {
    return this.#repository.findOne(id);
  }
}

export * from './types';
