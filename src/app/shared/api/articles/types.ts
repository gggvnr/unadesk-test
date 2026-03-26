export interface Article {
  id: string;
  title: string;
  content: string;
}

export type CreateArticlePayload = Omit<Article, 'id'>;
export type UpdateArticlePayload = Partial<CreateArticlePayload>;
