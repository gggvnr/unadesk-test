export interface ArticleNote {
  id: string;
  articleId: string;
  color: string;
  content: string;
  startOffset: number;
  endOffset: number;
}

export type CreateArticleNotePayload = Omit<ArticleNote, 'id'>;
export type UpdateArticleNotePayload = Partial<CreateArticleNotePayload>;
