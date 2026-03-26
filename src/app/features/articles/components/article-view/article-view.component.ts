import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  input,
  OnInit,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Article } from '@shared/api/articles';
import { ArticleNote } from '@shared/api/notes';
import { Button } from '@shared/components/button/button';
import { AsTooltipDirective } from '@shared/components/tooltip';
import { FloatingPanelService } from '@shared/services/floating-panel.service';
import { debounceTime, fromEvent } from 'rxjs';
import { TextSegment } from '../../interfaces';
import { ArticleService } from '../../services/article.service';
import { NoteEditorComponent } from '../note-editor/note-editor.component';

@Component({
  selector: 'app-article-view',
  templateUrl: './article-view.component.html',
  styleUrl: './article-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsTooltipDirective, Button],
})
export class ArticleViewComponent implements OnInit {
  #articleService = inject(ArticleService);
  #floatingPanelService = inject(FloatingPanelService);
  #document = inject(DOCUMENT);
  #destroyRef = inject(DestroyRef);

  article = input<Article>();
  notes = input<ArticleNote[]>();

  contentRef = viewChild<ElementRef<HTMLElement>>('contentRef');

  segments = computed<TextSegment[]>(() => this.getComputedSegments());

  ngOnInit(): void {
    fromEvent(this.#document, 'selectionchange')
      .pipe(debounceTime(300), takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.onSelectionChange();
      });
  }

  onSelectionChange(): void {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    const container = this.contentRef()?.nativeElement;

    if (!container?.contains(range.startContainer) || !container?.contains(range.endContainer)) {
      return;
    }

    const startOffset = this.getOffset(container, range.startContainer, range.startOffset);
    const endOffset = this.getOffset(container, range.endContainer, range.endOffset);

    if (startOffset === endOffset) return;

    const selectedStartOffset = Math.min(startOffset, endOffset);
    const selectedEndOffset = Math.max(startOffset, endOffset);

    const rangeRect = range.getBoundingClientRect();
    const panelX = rangeRect.left;
    const panelY = rangeRect.bottom;

    this.#floatingPanelService.show(
      NoteEditorComponent,
      panelX,
      panelY,
      {
        articleId: this.article()!.id,
        selectedStartOffset,
        selectedEndOffset,
      },
      [{ provide: ArticleService, useValue: this.#articleService }],
    );
  }

  deleteNote(id: string): void {
    this.#articleService.deleteNote(id);
  }

  private getComputedSegments(): TextSegment[] {
    const article = this.article();
    const notes = this.notes();

    if (!article) {
      return [];
    }

    const text = article.content;

    if (!notes?.length) {
      return [{ text, offset: 0, note: null }];
    }

    const clamp = (v: number) => Math.max(0, Math.min(v, text.length));
    const points = new Set<number>([0, text.length]);

    for (const n of notes) {
      points.add(clamp(n.startOffset));
      points.add(clamp(n.endOffset));
    }

    const sortedPoints = [...points].sort((a, b) => a - b);
    const segments: TextSegment[] = [];

    for (let i = 0; i < sortedPoints.length - 1; i++) {
      const start = sortedPoints[i];
      const end = sortedPoints[i + 1];

      if (start === end) {
        continue;
      }

      let note: (typeof notes)[number] | null = null;

      for (let j = notes.length - 1; j >= 0; j--) {
        const n = notes[j];

        if (n.startOffset <= start && n.endOffset >= end) {
          note = n;

          break;
        }
      }

      segments.push({
        text: text.slice(start, end),
        offset: start,
        note,
      });
    }

    return segments;
  }

  private getOffset(container: HTMLElement, node: Node, offset: number): number {
    const range = document.createRange();

    range.setStart(container, 0);
    range.setEnd(node, offset);

    const text = range.toString();

    return text.length;
  }
}
