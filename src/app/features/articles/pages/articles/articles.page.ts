import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BasePageHeaderComponent } from '@shared/components/base-page-header/base-page-header.component';
import { BasePageComponent } from '@shared/components/base-page/base-page.component';
import { Button } from '@shared/components/button/button';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { ArticlesService } from '../../services/articles.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.page.html',
  styleUrl: './articles.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ArticlesService],
  imports: [BasePageComponent, ArticleCardComponent, BasePageHeaderComponent, Button, RouterLink],
})
export class ArticlesPage implements OnInit {
  #articlesService = inject(ArticlesService);
  #router = inject(Router);

  articles = this.#articlesService.articles;
  loadingState = this.#articlesService.loadingState;

  ngOnInit(): void {
    this.#articlesService.loadArticles();
  }

  editArticle(id: string): void {
    this.#router.navigate(['articles', id, 'edit']);
  }

  deleteArticle(id: string): void {
    this.#articlesService.deleteArticle(id);
  }
}
