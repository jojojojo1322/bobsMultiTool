import fs from "node:fs";
import path from "node:path";
import { resolveContentDir } from "./content-paths";
import type { PlayContent } from "./types";

let cachedPlayContent: PlayContent[] | undefined;

function readPlayContent(slug: string): PlayContent {
  const filePath = path.join(resolveContentDir("play"), `${slug}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, "utf8")) as PlayContent;

  if (!content.slug || !content.title || !content.description || !content.type || !content.durationLabel || !content.updatedAt) {
    throw new Error(`Play content is missing required fields: ${filePath}`);
  }
  if (content.type === "micro-sim" && (!content.turns?.length || !content.endings?.length || !content.stats?.length)) {
    throw new Error(`Micro sim content is missing required fields: ${filePath}`);
  }
  if (content.type === "tap-game" && (!content.targets?.length || !content.endings?.length)) {
    throw new Error(`Tap game content is missing required fields: ${filePath}`);
  }
  if (content.type === "sort-match-game" && (!content.categories?.length || !content.items?.length || !content.endings?.length)) {
    throw new Error(`Sort match game content is missing required fields: ${filePath}`);
  }

  return content;
}

export function getPlayContents() {
  if (!cachedPlayContent) {
    const playDir = resolveContentDir("play");
    cachedPlayContent = fs
      .readdirSync(playDir)
      .filter((file) => file.endsWith(".json"))
      .map((file) => readPlayContent(path.basename(file, ".json")))
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }
  return cachedPlayContent;
}

export function getPlayContentBySlug(slug: string) {
  return getPlayContents().find((content) => content.slug === slug);
}
