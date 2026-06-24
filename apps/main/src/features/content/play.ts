import fs from "node:fs";
import path from "node:path";
import { resolveContentDir } from "./content-paths";
import type { PlayContent } from "./types";

let cachedPlayContent: PlayContent[] | undefined;

const playOrder = ["office-survival"];

function readPlayContent(slug: string): PlayContent {
  const filePath = path.join(resolveContentDir("play"), `${slug}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, "utf8")) as PlayContent;

  if (!content.slug || !content.title || !content.turns?.length || !content.endings?.length) {
    throw new Error(`Play content is missing required fields: ${filePath}`);
  }

  return content;
}

export function getPlayContents() {
  if (!cachedPlayContent) {
    cachedPlayContent = playOrder.map(readPlayContent);
  }
  return cachedPlayContent;
}

export function getPlayContentBySlug(slug: string) {
  return getPlayContents().find((content) => content.slug === slug);
}
