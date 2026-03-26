import { inject, Injectable } from '@angular/core';
import { ArticleNote, CreateArticleNotePayload, UpdateArticleNotePayload } from '@shared/api/notes';
import { NOTES_LS_KEY } from '@shared/constants';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { generateUuid } from '@shared/utils';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotesRepository {
  #localStorageService = inject(LocalStorageService);

  create(payload: CreateArticleNotePayload): Observable<ArticleNote> {
    const createdNote = {
      id: generateUuid(),
      ...payload,
    };

    const lsNotes = this.#localStorageService.getItem<ArticleNote[]>(NOTES_LS_KEY) || [];

    lsNotes.push(createdNote);

    this.#localStorageService.setItem(NOTES_LS_KEY, lsNotes);

    return of(createdNote);
  }

  update(id: string, payload: UpdateArticleNotePayload): Observable<ArticleNote> {
    const lsNotes = this.#localStorageService.getItem<ArticleNote[]>(NOTES_LS_KEY) || [];
    const resultNote = lsNotes.find((article) => article.id === id);

    if (!resultNote) {
      return of();
    }

    const resultNotes = lsNotes.map((note) => {
      if (note.id !== id) {
        return note;
      }

      return {
        ...note,
        ...payload,
      };
    });

    this.#localStorageService.setItem(NOTES_LS_KEY, resultNotes);

    return of({
      ...resultNote,
      ...payload,
    });
  }

  delete(id: string): Observable<string> {
    const lsNotes = this.#localStorageService.getItem<ArticleNote[]>(NOTES_LS_KEY) || [];
    const resultNotes = lsNotes.filter((note) => note.id !== id);

    this.#localStorageService.setItem(NOTES_LS_KEY, resultNotes);

    return of('Successfully deleted');
  }

  findByArticleId(articleId: string): Observable<ArticleNote[]> {
    const lsNotes = this.#localStorageService.getItem<ArticleNote[]>(NOTES_LS_KEY) || [];
    const resultNotes = lsNotes.filter((note) => note.articleId === articleId);

    return of(resultNotes);
  }
}
