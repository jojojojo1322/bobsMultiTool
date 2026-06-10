export interface GuideSection {
  heading: string;
  body: string;
}

export interface GuideDefinition {
  slug: string;
  title: string;
  description: string;
  relatedTools: string[];
  sections: GuideSection[];
}

const sections = (focus: string): GuideSection[] => [
  {
    heading: "Start with the smallest reliable input",
    body: `Use ${focus} with a short real sample before pasting a large payload. Smaller inputs make syntax, encoding, and formatting mistakes easier to see.`,
  },
  {
    heading: "Keep sensitive data out",
    body: "Browser-based utilities are useful for speed, but production secrets, private tokens, customer data, and internal hostnames should still be redacted.",
  },
  {
    heading: "Copy only after checking the result",
    body: "Generated output should be treated as a draft until you confirm the target runtime, syntax variant, or platform behavior.",
  },
];

export const guides: GuideDefinition[] = [
  {
    slug: "regex-cheat-sheet",
    title: "Regex cheat sheet for practical JavaScript patterns",
    description: "Common JavaScript regular expression patterns, flags, and matching notes for day-to-day development.",
    relatedTools: ["regex-tester", "json-formatter", "url-encoder"],
    sections: sections("regex testing"),
  },
  {
    slug: "cron-expression-examples",
    title: "Cron expression examples and scheduling caveats",
    description: "A compact guide to common five-field cron schedules, time zone behavior, and Quartz differences.",
    relatedTools: ["cron-generator", "timestamp-converter", "timezone-converter"],
    sections: sections("cron and time conversion"),
  },
  {
    slug: "seo-meta-tags",
    title: "SEO meta tags that are worth generating",
    description: "The metadata fields that usually matter for search snippets, social previews, and duplicate URL handling.",
    relatedTools: ["meta-tag-generator", "open-graph-preview", "sitemap-generator"],
    sections: sections("SEO metadata generation"),
  },
  {
    slug: "iframe-preview-limitations",
    title: "Iframe preview limitations developers should expect",
    description: "Why some pages refuse to render in iframes and how to interpret that failure during responsive testing.",
    relatedTools: ["iframe-viewer", "http-status-checker", "url-parser"],
    sections: sections("iframe previewing"),
  },
  {
    slug: "placeholder-text-for-design",
    title: "Placeholder text patterns for product design",
    description: "How to use dummy content without hiding layout, accessibility, and product copy problems.",
    relatedTools: ["lorem-ipsum-generator", "word-character-counter", "case-converter"],
    sections: sections("placeholder text generation"),
  },
  {
    slug: "developer-utility-workflow",
    title: "A practical workflow for browser-based developer utilities",
    description: "A simple way to use local browser utilities while keeping sensitive payloads and production data safe.",
    relatedTools: ["json-formatter", "env-parser-validator", "jwt-decoder", "base64-tool"],
    sections: sections("browser-based utilities"),
  },
  {
    slug: "hash-generator-security",
    title: "Hash generator security notes",
    description: "How to use MD5, SHA-1, SHA-256, and SHA-512 outputs without confusing hashing with encryption.",
    relatedTools: ["hash-generator", "base64-tool", "random-token-generator"],
    sections: sections("hash generation"),
  },
  {
    slug: "text-diff-for-developers",
    title: "Text diff workflow for developers",
    description: "A practical way to compare snippets, config changes, logs, and payload revisions.",
    relatedTools: ["text-diff", "text-sort-dedupe", "json-formatter"],
    sections: sections("text comparison"),
  },
  {
    slug: "json-yaml-csv-conversion",
    title: "JSON, YAML, and CSV conversion workflow",
    description: "How to move data between common formats while preserving structure and validating output.",
    relatedTools: ["json-formatter", "yaml-validator", "yaml-json-converter", "csv-json-converter"],
    sections: sections("data conversion"),
  },
  {
    slug: "sql-formatting-workflow",
    title: "SQL formatting workflow",
    description: "How to format SQL queries for review, debugging, and readable diffs.",
    relatedTools: ["sql-formatter", "text-diff", "csv-json-converter"],
    sections: sections("SQL formatting"),
  },
  {
    slug: "color-contrast-checking",
    title: "Color conversion and contrast checking",
    description: "Use HEX, RGB, HSL, and contrast ratios to keep interface colors readable.",
    relatedTools: ["color-converter", "css-unit-converter", "css-clamp-generator"],
    sections: sections("color conversion"),
  },
  {
    slug: "secure-generator-workflow",
    title: "Secure random generator workflow",
    description: "How to generate passwords, tokens, UUIDs, and ULIDs for local development without overclaiming security.",
    relatedTools: ["password-generator", "random-token-generator", "uuid-generator", "ulid-generator"],
    sections: sections("secure random generation"),
  },
  {
    slug: "web-seo-utilities",
    title: "Practical web and SEO utilities",
    description: "A compact workflow for robots.txt, sitemaps, favicons, URL parsing, and social previews.",
    relatedTools: ["robots-txt-generator", "sitemap-generator", "open-graph-preview", "favicon-generator"],
    sections: sections("web and SEO utilities"),
  },
  {
    slug: "network-debugging-tools",
    title: "Network debugging tools workflow",
    description: "How to use HTTP status checks and DNS lookups for public web debugging.",
    relatedTools: ["http-status-checker", "dns-lookup", "url-parser"],
    sections: sections("network debugging"),
  },
  {
    slug: "css-utility-workflow",
    title: "CSS utility workflow",
    description: "Use CSS formatting, minification, unit conversion, and clamp values for layout work.",
    relatedTools: ["css-formatter", "css-minifier", "css-unit-converter", "css-clamp-generator"],
    sections: sections("CSS utilities"),
  },
  {
    slug: "text-cleanup-workflow",
    title: "Text cleanup workflow",
    description: "Sort, dedupe, count, preview, and normalize text before using it in code or content systems.",
    relatedTools: ["case-converter", "slug-generator", "text-sort-dedupe", "word-character-counter"],
    sections: sections("text cleanup"),
  },
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
