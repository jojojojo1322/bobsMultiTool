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

export type PlayType = "micro-sim" | "tap-game" | "sort-match-game";

type PlayBase = {
  slug: string;
  title: string;
  description: string;
  type: PlayType;
  durationLabel: string;
  shareText: string;
  relatedBlogSlugs: string[];
  relatedPlaySlugs: string[];
  order?: number;
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

export type MicroSimPlayContent = PlayBase & {
  type: "micro-sim";
  stats: PlayStat[];
  turns: PlayTurn[];
  endings: PlayEnding[];
};

export type TapGameTarget = {
  id: string;
  label: string;
  detail: string;
  kind: "target" | "decoy";
  points: number;
};

export type TapGameContent = PlayBase & {
  type: "tap-game";
  targetLabel: string;
  decoyLabel: string;
  targetScore: number;
  targets: TapGameTarget[];
  endings: PlayScoreEnding[];
};

export type SortMatchCategory = {
  id: string;
  label: string;
  description: string;
};

export type SortMatchItem = {
  id: string;
  label: string;
  detail: string;
  categoryId: string;
};

export type SortMatchGameContent = PlayBase & {
  type: "sort-match-game";
  categories: SortMatchCategory[];
  items: SortMatchItem[];
  endings: PlayScoreEnding[];
};

export type PlayScoreEnding = {
  id: string;
  title: string;
  description: string;
  minScore: number;
};

export type PlayContent = MicroSimPlayContent | TapGameContent | SortMatchGameContent;
