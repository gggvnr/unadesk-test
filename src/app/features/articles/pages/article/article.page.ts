import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasePageHeaderComponent } from '@shared/components/base-page-header/base-page-header.component';
import { BasePageComponent } from '@shared/components/base-page/base-page.component';
import { ArticleFormComponent } from '../../components/article-form/article-form.component';
import { ArticleViewComponent } from '../../components/article-view/article-view.component';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrl: './article.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ArticleService],
  imports: [BasePageComponent, BasePageHeaderComponent, ArticleViewComponent, ArticleFormComponent],
})
export class ArticlePage implements OnInit {
  #activatedRoute = inject(ActivatedRoute);
  #articleService = inject(ArticleService);

  article = this.#articleService.article;
  notes = this.#articleService.notes;

  pageTitle = signal('');

  isEditMode = signal(false);

  ngOnInit(): void {
    const pageId = this.#activatedRoute.snapshot.params['id'];
    const editModeFlag = this.#activatedRoute.snapshot.data['editMode'];

    this.isEditMode.set(!!editModeFlag);

    if (editModeFlag) {
      this.pageTitle.set(pageId ? `Редактирование статьи ${pageId}` : 'Новая статья');
    } else {
      this.pageTitle.set(`Статья ${pageId}`);
    }

    if (!pageId) {
      return;
    }

    this.#articleService.loadArticleWithNotes(pageId);
  }
}
