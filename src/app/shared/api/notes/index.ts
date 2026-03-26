import { inject, Injectable } from '@angular/core';
import { NotesRepository } from '@shared/repository/notes.repository';
import { Observable } from 'rxjs';
import { ArticleNote, CreateArticleNotePayload, UpdateArticleNotePayload } from './types';

@Injectable({ providedIn: 'root' })
export class NotesApiService {
  #repository = inject(NotesRepository);

  createNote(payload: CreateArticleNotePayload): Observable<ArticleNote> {
    return this.#repository.create(payload);
  }

  updateNote(id: string, payload: UpdateArticleNotePayload): Observable<ArticleNote> {
    return this.#repository.update(id, payload);
  }

  deleteNote(id: string): Observable<string> {
    return this.#repository.delete(id);
  }

  getNotesByArticleId(articleId: string): Observable<ArticleNote[]> {
    return this.#repository.findByArticleId(articleId);
  }
}

export * from './types';
