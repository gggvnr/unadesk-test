import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Article, ArticlesApiService } from '@shared/api/articles';
import { ArticleNote, NotesApiService } from '@shared/api/notes';
import { FloatingPanelService } from '@shared/services/floating-panel.service';
import { forkJoin } from 'rxjs';

@Injectable()
export class ArticleService {
  #articlesApiService = inject(ArticlesApiService);
  #notesApiService = inject(NotesApiService);
  #router = inject(Router);
  #destroyRef = inject(DestroyRef);
  #floatingPanelService = inject(FloatingPanelService);

  article = signal<Article | null>(null);
  notes = signal<ArticleNote[]>([]);

  loadArticleWithNotes(id: string): void {
    forkJoin([
      this.#articlesApiService.getArticleById(id),
      this.#notesApiService.getNotesByArticleId(id),
    ])
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: ([article, notes]) => {
          this.article.set(article);
          this.notes.set(notes);
        },
      });
  }

  createArticle(...args: Parameters<ArticlesApiService['createArticle']>): void {
    this.#articlesApiService
      .createArticle(...args)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.#router.navigate(['articles']);
        },
      });
  }

  updateArticle(...args: Parameters<ArticlesApiService['updateArticle']>): void {
    const [_, payload] = args;

    const oldText = this.article()!.content;
    const newText = payload.content!;

    this.#articlesApiService
      .updateArticle(...args)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.#router.navigate(['articles']);

          this.adjustNotesOffsets(oldText, newText);
        },
      });
  }

  createNote(...args: Parameters<NotesApiService['createNote']>): void {
    this.#notesApiService
      .createNote(...args)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (response) => {
          this.#floatingPanelService.hide();
          this.notes.update((notes) => [...notes, response]);
        },
      });
  }

  updateNote(...args: Parameters<NotesApiService['updateNote']>): void {
    const [noteId] = args;

    this.#notesApiService
      .updateNote(...args)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (response) => {
          this.#floatingPanelService.hide();
          this.notes.update((notes) =>
            notes.map((note) => {
              if (note.id !== noteId) {
                return note;
              }

              return {
                ...note,
                ...response,
              };
            }),
          );
        },
      });
  }

  deleteNote(...args: Parameters<NotesApiService['deleteNote']>): void {
    this.#notesApiService
      .deleteNote(...args)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.notes.update((notes) => notes.filter((note) => note.id !== args[0]));
        },
      });
  }

  private adjustNotesOffsets(oldText: string, newText: string): void {
    if (oldText === newText) {
      return;
    }

    const notes = this.notes();

    for (const note of notes) {
      const anchor = oldText.slice(note.startOffset, note.endOffset);

      if (!anchor) {
        this.deleteNote(note.id);

        continue;
      }

      const newIndex = this.findClosestOccurrence(newText, anchor, note.startOffset);

      if (newIndex < 0) {
        this.deleteNote(note.id);

        continue;
      }

      if (newIndex !== note.startOffset) {
        this.updateNote(note.id, {
          startOffset: newIndex,
          endOffset: newIndex + anchor.length,
        });
      }
    }
  }

  private findClosestOccurrence(text: string, search: string, originalOffset: number): number {
    let best = -1;
    let bestDist = Infinity;
    let index = text.indexOf(search);

    while (index !== -1) {
      const dist = Math.abs(index - originalOffset);

      if (dist < bestDist) {
        bestDist = dist;
        best = index;

        if (dist === 0) {
          return index;
        }
      }

      if (index > originalOffset && index - originalOffset > bestDist) {
        break;
      }

      index = text.indexOf(search, index + 1);
    }

    return best;
  }
}
