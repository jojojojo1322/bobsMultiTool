export type ContentLocale = "ko" | "en";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readingMinutes: number;
  relatedPlaySlugs: string[];
  sourcePath: string;
  body: BlogBlock[];
};

export type BlogBlock =
  | {
      type: "heading";
      text: string;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "list";
      items: string[];
    };

export type PlayStatKey = "stamina" | "mental" | "workload" | "reputation";

export type PlayStat = {
  key: PlayStatKey;
  label: string;
  initial: number;
};

export type PlayChoice = {
  label: string;
  detail: string;
  effects: Partial<Record<PlayStatKey, number>>;
};

export type PlayTurn = {
  id: string;
  title: string;
  situation: string;
  choices: PlayChoice[];
};

export type EndingRule = {
  stat: PlayStatKey;
  op: "<=" | ">=";
  value: number;
};

export type PlayEnding = {
  id: string;
  title: string;
  description: string;
  conditions: EndingRule[];
};

export type PlayContent = {
  slug: string;
  title: string;
  description: string;
  type: "survival" | "personality" | "balance" | "quiz";
  durationLabel: string;
  shareText: string;
  supportUrl: string;
  relatedBlogSlugs: string[];
  relatedPlaySlugs: string[];
  stats: PlayStat[];
  turns: PlayTurn[];
  endings: PlayEnding[];
};
