import fs from "node:fs";
import path from "node:path";
import { resolveContentDir } from "./content-paths";
import type { BlogBlock, BlogPost } from "./types";

type Frontmatter = {
  slug?: string;
  title?: string;
  description?: string;
  date?: string;
  category?: string;
  readingMinutes?: string;
  relatedPlay?: string;
};

let cachedPosts: BlogPost[] | undefined;

function parseFrontmatter(source: string): { frontmatter: Frontmatter; body: string } {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: source };

  const frontmatter = Object.fromEntries(
    match[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf(":");
        if (separatorIndex === -1) return [line, ""];
        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim().replace(/^"|"$/g, "");
        return [key, value];
      }),
  ) as Frontmatter;

  return { frontmatter, body: match[2] };
}

function parseMarkdownBlocks(markdown: string): BlogBlock[] {
  const blocks: BlogBlock[] = [];
  const lines = markdown.split("\n");
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let tableRows: string[][] = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() });
    paragraph = [];
  }

  function flushList() {
    if (!listItems.length) return;
    blocks.push({ type: "list", items: listItems });
    listItems = [];
  }

  function flushTable() {
    if (tableRows.length < 2) {
      tableRows = [];
      return;
    }
    const [headers, separator, ...rows] = tableRows;
    const isSeparator = separator.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s/g, "")));
    if (headers.length && isSeparator && rows.length) {
      blocks.push({ type: "table", headers, rows: rows.filter((row) => row.some(Boolean)) });
    }
    tableRows = [];
  }

  function parseTableLine(line: string) {
    if (!line.startsWith("|") || !line.endsWith("|")) return null;
    return line
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim());
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      flushTable();
      continue;
    }
    const tableCells = parseTableLine(line);
    if (tableCells) {
      flushParagraph();
      flushList();
      tableRows.push(tableCells);
      continue;
    }
    flushTable();
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", text: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith("- ")) {
      flushParagraph();
      listItems.push(line.slice(2).trim());
      continue;
    }
    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  flushTable();
  return blocks;
}

function readBlogPost(filePath: string): BlogPost {
  const raw = fs.readFileSync(filePath, "utf8");
  const { frontmatter, body } = parseFrontmatter(raw);
  const slug = frontmatter.slug;
  const title = frontmatter.title;
  const description = frontmatter.description;
  const date = frontmatter.date;

  if (!slug || !title || !description || !date) {
    throw new Error(`Blog post is missing required frontmatter: ${filePath}`);
  }

  return {
    slug,
    title,
    description,
    date,
    category: frontmatter.category ?? "General",
    readingMinutes: Number(frontmatter.readingMinutes ?? 3),
    relatedPlaySlugs: frontmatter.relatedPlay ? frontmatter.relatedPlay.split(",").map((item) => item.trim()).filter(Boolean) : [],
    sourcePath: path.relative(process.cwd(), filePath),
    body: parseMarkdownBlocks(body),
  };
}

export function getBlogPosts() {
  if (!cachedPosts) {
    const blogDir = resolveContentDir("blog");
    cachedPosts = fs
      .readdirSync(blogDir)
      .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
      .map((file) => readBlogPost(path.join(blogDir, file)))
      .sort((a, b) => b.date.localeCompare(a.date));
  }
  return cachedPosts;
}

export function getBlogPostBySlug(slug: string) {
  return getBlogPosts().find((post) => post.slug === slug);
}
