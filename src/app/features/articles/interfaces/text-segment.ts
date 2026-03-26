import { ArticleNote } from '@shared/api/notes';

export interface TextSegment {
  text: string;
  offset: number;
  note: ArticleNote | null;
}
