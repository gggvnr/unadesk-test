import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from '@shared/components/button/button';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
})
export class ArticleCardComponent {
  title = input<string>();
  content = input<string>();

  edit = output();
  delete = output();

  handleEdit(event: Event): void {
    this.edit.emit();

    event.stopPropagation();
  }

  handleDelete(event: Event): void {
    this.delete.emit();

    event.stopPropagation();
  }
}
