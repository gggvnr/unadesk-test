import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateArticleNotePayload } from '@shared/api/notes';
import { Button } from '@shared/components/button/button';
import { FLOATING_PANEL_DATA, FLOATING_PANEL_REF } from '@shared/services/floating-panel.service';
import { noteColors } from '../../constants';
import { NoteEditorData } from '../../constants/note-editor-data';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ReactiveFormsModule],
})
export class NoteEditorComponent {
  #articleService = inject(ArticleService);

  #overlayRef = inject(FLOATING_PANEL_REF, { optional: true });
  #data = inject<NoteEditorData>(FLOATING_PANEL_DATA, { optional: true });

  noteFieldRef = viewChild<ElementRef<HTMLTextAreaElement>>('noteFieldRef');

  form = new FormGroup({
    color: new FormControl(noteColors[0]),
    note: new FormControl('', [Validators.required]),
  });

  readonly noteColors = noteColors;

  constructor() {
    effect(() => {
      const noteFieldRef = this.noteFieldRef();

      if (noteFieldRef) {
        noteFieldRef.nativeElement.focus();
      }
    });
  }

  selectColor(color: (typeof noteColors)[number]): void {
    this.form.get('color')?.setValue(color);
  }

  handleSubmit(): void {
    if (!this.form.valid || !this.#data) {
      return;
    }

    const formData = this.form.value;
    const payload: CreateArticleNotePayload = {
      articleId: this.#data.articleId,
      color: formData.color ?? noteColors[0],
      content: formData.note ?? '',
      startOffset: this.#data.selectedStartOffset,
      endOffset: this.#data.selectedEndOffset,
    };

    this.#articleService.createNote(payload);
    this.#overlayRef?.detach();
  }

  handleCancel(): void {
    this.#overlayRef?.detach();
  }
}
