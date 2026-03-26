import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Article } from '@shared/api/articles';
import { Button } from '@shared/components/button/button';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Button],
})
export class ArticleFormComponent {
  #articleService = inject(ArticleService);

  initialData = input<Article | null>();

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', []),
  });

  constructor() {
    const effectRef = effect(() => {
      const initialData = this.initialData();

      if (initialData) {
        this.form.setValue({
          title: initialData.title,
          content: initialData.content,
        });

        effectRef.destroy();
      }
    });
  }

  submit(): void {
    if (!this.form.valid) {
      return;
    }

    const formData = {
      title: this.form.value.title ?? '',
      content: this.form.value.content ?? '',
    };

    if (!this.initialData()) {
      this.#articleService.createArticle(formData);
    } else {
      this.#articleService.updateArticle(this.initialData()!.id, formData);
    }
  }
}
