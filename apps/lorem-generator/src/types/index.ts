export type Language = 'en' | 'ko' | 'zh' | 'ja' | 'vi';

export type LoremType = 'words' | 'sentences' | 'paragraphs';

export interface LoremOptions {
  language: Language;
  type: LoremType;
  count: number;
} 