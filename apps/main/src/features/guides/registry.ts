export interface GuideSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface GuideDefinition {
  slug: string;
  title: string;
  description: string;
  relatedTools: string[];
  sections: GuideSection[];
}

const guideSections = {
  "regex-cheat-sheet": [
    {
      heading: "Choose the JavaScript engine on purpose",
      body: "Regex syntax changes across engines, so the first quality check is confirming the pattern will run in JavaScript. A pattern copied from PCRE, Python, or a search product can fail on lookbehind support, named groups, escaping, or flag behavior.",
      bullets: ["Test with the browser JavaScript RegExp engine before copying.", "Keep one sample that must match and one sample that must fail.", "Check flags separately from the pattern body."],
    },
    {
      heading: "Use common snippets as drafts",
      body: "Email, URL, UUID, IPv4, HEX color, ISO date, and slug snippets are useful starting points, but none of them can prove business validity by themselves. Treat each snippet as a readable draft that still needs product-specific boundary checks.",
      bullets: ["Use email regex for shape checks, not deliverability.", "Use URL regex for extraction only when URL parsing is not available.", "Use UUID and IPv4 snippets to find candidates in logs before validation."],
    },
    {
      heading: "Inspect capture groups before using parsed values",
      body: "A regex can match the right text while returning the wrong captured value to application code. Inspecting group output makes route parsing, log extraction, and validation code easier to review before the pattern is committed.",
      bullets: ["Name groups when the target runtime supports them.", "Prefer non-capturing groups when a group is only for precedence.", "Compare group positions after adding optional parts."],
    },
    {
      heading: "Avoid fragile escaping mistakes",
      body: "Most production regex bugs come from copying the pattern into a string literal, JSON value, route config, or shell command without adjusting backslashes. Check the raw pattern and the slash-wrapped or string-literal form separately.",
      bullets: ["A JavaScript string often needs doubled backslashes.", "A JSON string needs escaped quotes and backslashes.", "A slash-wrapped literal needs escaped slashes inside the pattern."],
    },
    {
      heading: "Continue the workflow with adjacent tools",
      body: "Regex checks usually sit inside a larger debugging loop. Format JSON logs before extracting fields, parse URLs before writing URL patterns, and use Text Diff when a pattern changed between releases.",
      bullets: ["JSON Formatter helps expose payload fields before pattern matching.", "URL Encoder protects callback and redirect parameters.", "Text Diff makes pattern revisions easier to review."],
    },
  ],
  "cron-expression-examples": [
    {
      heading: "Confirm the cron dialect before copying",
      body: "Five-field crontab syntax is not the same as Quartz, cloud scheduler, or framework-specific cron syntax. Start by checking whether the scheduler expects minute hour day-of-month month day-of-week, or whether it also needs seconds and year fields.",
      bullets: ["Five-field examples usually start with the minute field.", "Quartz examples often include seconds at the beginning.", "Some hosted schedulers document timezone outside the expression."],
    },
    {
      heading: "Map the schedule to a human sentence",
      body: "A cron expression should be translated into a plain schedule before it is copied into production config. If the sentence sounds ambiguous, the expression probably needs a day-of-month or day-of-week review.",
      bullets: ["*/15 * * * * means every 15 minutes, not every 15 seconds.", "0 9 * * 1-5 means weekday mornings in the scheduler timezone.", "30 8 1 * * means the first day of every month at 08:30."],
    },
    {
      heading: "Handle day-of-month and day-of-week carefully",
      body: "Schedulers do not always agree on whether both fields are combined with OR or AND semantics. A monthly report, weekday job, and first-Monday job can look similar while firing on very different dates.",
      bullets: ["Use one field as * when you do not need it.", "Review scheduler docs before combining both day fields.", "Preview multiple upcoming runs, not only the next one."],
    },
    {
      heading: "Separate expression problems from timezone problems",
      body: "The cron string rarely stores the timezone by itself, so a correct expression can still run at the wrong local time. Compare browser timezone, server timezone, container timezone, and provider setting before blaming the expression.",
      bullets: ["Record the expected timezone beside the copied expression.", "Check daylight-saving behavior for user-facing jobs.", "Use timestamp and timezone tools when debugging run logs."],
    },
    {
      heading: "Use staging before long-running schedules",
      body: "Cron mistakes are expensive because they repeat silently. Test the schedule with a harmless staging job, short retention window, and observable log message before attaching it to billing, cleanup, notifications, or data exports.",
      bullets: ["Log the scheduled local time and UTC time.", "Use a short test window before monthly or yearly jobs.", "Keep rollback instructions near the scheduler config."],
    },
  ],
  "seo-meta-tags": [
    {
      heading: "Start with one final page identity",
      body: "Meta tags work best when title, description, canonical URL, Open Graph URL, and visible page content all describe the same final page. If redirects, alternate locales, or query strings point to different versions, fix that before tuning text.",
      bullets: ["Canonical should point to the indexable final URL.", "Open Graph URL should not contradict canonical.", "Titles should name the page, not a vague site slogan."],
    },
    {
      heading: "Write snippets for the actual task",
      body: "Search descriptions should explain the page outcome and the user action. For tools, that usually means the input, the output, privacy mode, and the main review step rather than generic words like fast, simple, or best.",
      bullets: ["Mention the concrete utility, such as JSON formatting or DNS lookup.", "Avoid repeated site-wide boilerplate across every page.", "Keep social preview text consistent with the visible page header."],
    },
    {
      heading: "Use robots tags only for clear indexing decisions",
      body: "Robots directives are powerful but easy to misuse. A noindex draft can be correct during staging, but leaving it on a public tool page can remove useful content from search entirely.",
      bullets: ["Use indexable defaults for canonical tool pages.", "Use noindex for duplicate, private, or temporary pages only.", "Check generated tags after copy-pasting into a template."],
    },
    {
      heading: "Review image and social preview readiness",
      body: "Open Graph and X card tags should use public HTTPS image URLs with suitable dimensions and stable hosts. A missing image should not block the page, but broken preview assets weaken sharing and can make the page look unfinished.",
      bullets: ["Prefer absolute HTTPS image URLs.", "Check image host, format, and dimensions.", "Keep alt or surrounding visible context available on the page."],
    },
    {
      heading: "Pair metadata with crawl checks",
      body: "Metadata cannot compensate for blocked crawling, broken redirects, duplicate routes, or thin visible content. Use robots.txt, sitemap, URL parsing, HTTP status checks, and Open Graph preview together before resubmitting a page for review.",
      bullets: ["Check that important pages return final 200 responses.", "Confirm sitemap URLs match canonical URLs.", "Use visible content and FAQ to support the generated snippet."],
    },
  ],
  "iframe-preview-limitations": [
    {
      heading: "Know what an iframe preview can prove",
      body: "An iframe preview can show viewport sizing, scrollbar behavior, and responsive layout when the target page allows embedding. It cannot override browser security headers or guarantee that a third-party page is safe to embed in production.",
      bullets: ["Use it for public pages and layout checks.", "Do not treat a blocked frame as a site outage.", "Check the real browser console when embedding fails."],
    },
    {
      heading: "Read frame-blocking headers correctly",
      body: "X-Frame-Options and Content-Security-Policy frame-ancestors are common reasons a page refuses to load in an iframe. That failure is often intentional security behavior, especially for dashboards, accounts, payment pages, and admin tools.",
      bullets: ["DENY blocks all framing.", "SAMEORIGIN allows only same-origin framing.", "frame-ancestors controls allowed embedding origins in CSP."],
    },
    {
      heading: "Use realistic viewport sizes",
      body: "Responsive bugs often appear between named device presets rather than exactly at a preset width. Test desktop, tablet, and mobile frames, then manually adjust nearby widths if a component is close to wrapping.",
      bullets: ["Check narrow mobile content for horizontal overflow.", "Use tablet frames for two-column breakpoints.", "Check desktop frames with sidebars and long text."],
    },
    {
      heading: "Separate embed markup from product approval",
      body: "A copied iframe tag only describes dimensions and source. Production embedding also needs consent, security review, sandbox attributes, loading behavior, and a fallback state when the source is blocked.",
      bullets: ["Use sandbox intentionally when embedding untrusted pages.", "Add a fallback link for blocked or slow frames.", "Avoid embedding login, payment, or private content."],
    },
    {
      heading: "Continue with status and URL tools",
      body: "When a preview fails, check whether the URL is valid, whether redirects land on the expected host, and whether headers explain the frame behavior. URL Parser and HTTP Status Checker are the natural follow-up tools.",
      bullets: ["Parse query strings before blaming the frame.", "Inspect redirect chains for host or protocol changes.", "Review response headers for CSP and frame policy."],
    },
  ],
  "placeholder-text-for-design": [
    {
      heading: "Use placeholder copy to reveal layout issues",
      body: "Dummy text should behave like real product copy, not hide problems with perfectly even words. The best samples include short labels, long labels, empty states, helper text, and error messages with different line lengths.",
      bullets: ["Test one-line and multi-line card descriptions.", "Use realistic button and form labels.", "Include at least one long unbroken token when checking overflow."],
    },
    {
      heading: "Match text density to the component",
      body: "A marketing hero, data table, modal, and settings panel need different text rhythm. Generate copy for the actual container so spacing, line height, and wrapping decisions are visible before final content is written.",
      bullets: ["Use compact samples for dense app panels.", "Use paragraph samples for article or guide layouts.", "Use short fragments for chips, tabs, and buttons."],
    },
    {
      heading: "Do not ship placeholder content",
      body: "Placeholder text on a public page signals that the site is unfinished and can weaken user trust. Replace it with real descriptions, examples, FAQs, and workflow notes before launch or monetization review.",
      bullets: ["Search for lorem, placeholder, todo, and sample-only text before release.", "Check metadata and Open Graph text as well as visible body copy.", "Avoid generic repeated paragraphs across many pages."],
    },
    {
      heading: "Check accessibility while testing copy",
      body: "Generated placeholder text can expose focus order, label association, line-height, and contrast problems if it is used deliberately. Test form help text, error state copy, and screen-reader-friendly labels rather than only visual paragraphs.",
      bullets: ["Use labels that describe the control action.", "Keep helper text near the field it explains.", "Check contrast after text wraps to a second line."],
    },
    {
      heading: "Move from placeholder to content workflow",
      body: "After layout checks, use the counter, case converter, slug generator, and text cleanup tools to shape real copy. This keeps the page useful instead of relying on filler.",
      bullets: ["Count title and description lengths.", "Normalize route slugs and headings.", "Sort and dedupe repeated content notes."],
    },
  ],
  "developer-utility-workflow": [
    {
      heading: "Use a repeatable local-first loop",
      body: "A practical utility workflow starts with redacted input, runs the smallest useful transformation, reviews warnings, and copies only after the result fits the target runtime. This is more useful than treating each tool as a one-click black box.",
      bullets: ["Redact secrets before pasting.", "Use the shortest sample that still proves the issue.", "Copy only the reviewed output, not surrounding debug noise."],
    },
    {
      heading: "Start with structure, then inspect details",
      body: "For API payloads and config files, structure matters before individual values. Format JSON, validate YAML, parse ENV, or convert CSV first, then inspect fields, schemas, timestamps, and tokens after the shape is clear.",
      bullets: ["Format before comparing large payloads.", "Validate before converting formats.", "Extract one field only after the root structure is understood."],
    },
    {
      heading: "Keep browser-local and server-route tools distinct",
      body: "Browser-local tools are useful for private drafting, but server-route checks are only suitable for public URLs or public hostnames. DNS lookup and HTTP status checks should never receive internal network names or credentials.",
      bullets: ["Local formatters run in the browser.", "Network checks need a small server route.", "Private hosts should be checked inside your own environment."],
    },
    {
      heading: "Use adjacent tools instead of manual rework",
      body: "The strongest workflow usually chains two or three deterministic tools. Decode a JWT, convert its timestamps, format its payload, and redact sensitive claims before sharing a bug report.",
      bullets: ["JWT Decoder pairs with Timestamp Converter.", "Base64 pairs with JSON Formatter when decoded output is JSON.", "DNS Lookup pairs with HTTP Status Checker for deployment issues."],
    },
    {
      heading: "Turn output into a review artifact",
      body: "A copied result should explain enough context for the next person to trust it. Include the tool used, the redaction decision, the runtime or timezone assumption, and any warning that changed the interpretation.",
      bullets: ["Mention whether the result was decoded, formatted, generated, or validated.", "Preserve warning text when it changes the decision.", "Avoid pasting raw production values into tickets or docs."],
    },
  ],
  "hash-generator-security": [
    {
      heading: "Do not confuse hashing with encryption",
      body: "A hash is a one-way digest, not a protected version of the original content. It can prove that two inputs match, but it cannot keep a weak or known input secret.",
      bullets: ["Hashes are useful for checksums and fingerprints.", "Hashes do not hide predictable input from guessing.", "Encrypted content should be handled by a dedicated cryptographic workflow."],
    },
    {
      heading: "Choose the algorithm for the job",
      body: "MD5 and SHA-1 remain common for legacy compatibility, but they should not be selected for modern security-sensitive integrity checks. SHA-256, SHA-512, and HMAC variants are usually safer choices for current workflows.",
      bullets: ["Use MD5 only when a legacy system requires it.", "Use SHA-256 or SHA-512 for modern checksum work.", "Use HMAC when a shared secret must authenticate a payload."],
    },
    {
      heading: "Normalize input before comparing digests",
      body: "Whitespace, hidden newlines, Unicode normalization, and file encoding can change the digest completely. If two hashes differ, inspect the exact byte-level input before assuming the algorithm is wrong.",
      bullets: ["Check trailing newline differences.", "Confirm UTF-8 versus other encodings.", "Copy the same canonical text representation for comparison."],
    },
    {
      heading: "Treat HMAC secrets carefully",
      body: "HMAC output is only meaningful when the secret remains private and stable. A browser helper can draft or compare a signature, but production secrets should be handled in your own trusted environment.",
      bullets: ["Use redacted or test secrets in public tools.", "Compare full signatures, not short prefixes.", "Keep webhook signing strings exactly as the provider documents them."],
    },
    {
      heading: "Use related tools for transport values",
      body: "Hash results are often copied into headers, JSON, Base64 transport values, or release notes. Format the surrounding payload and check encoding before sharing the digest as evidence.",
      bullets: ["Base64 helps inspect encoded webhook pieces.", "JSON Formatter helps review signed payload shape.", "Text Diff helps compare before-and-after checksum notes."],
    },
  ],
  "text-diff-for-developers": [
    {
      heading: "Normalize only when it matches the question",
      body: "A diff can answer different questions depending on whether whitespace, casing, sorting, or punctuation matters. Decide whether the review is about exact bytes, visible text, config semantics, or human-readable copy before comparing.",
      bullets: ["Use exact line diff for code and config changes.", "Use word diff for prose revisions.", "Sort and dedupe only when order is not meaningful."],
    },
    {
      heading: "Compare small slices first",
      body: "Large pasted logs or generated files can hide the important change. Trim the input to the function, object, query, or paragraph that changed, then expand the diff only if context is missing.",
      bullets: ["Remove unrelated timestamps when checking log messages.", "Keep surrounding braces for JSON or code snippets.", "Compare generated output after formatting both sides consistently."],
    },
    {
      heading: "Use diff to protect meaning",
      body: "Formatting, minification, and cleanup tools can change text in ways that look harmless. A quick diff helps confirm whether only whitespace changed or whether a selector, query condition, token, or data field moved.",
      bullets: ["Diff SQL before running a reformatted query.", "Diff CSS after minification when comments or hacks matter.", "Diff JSON after conversion when arrays or null values are important."],
    },
    {
      heading: "Keep sensitive context out of comparisons",
      body: "Diffs are often copied into pull requests, tickets, and chats. Redact secrets, private hostnames, customer rows, and one-off production identifiers before creating a shareable comparison.",
      bullets: ["Replace tokens with stable placeholders.", "Keep line counts and structure after redaction when possible.", "Avoid screenshotting unredacted side-by-side diffs."],
    },
    {
      heading: "Turn the result into a decision",
      body: "A useful diff ends with a clear next action: accept the copy change, reject a risky config change, rerun a formatter, or inspect a specific field. Use related tools when the diff shows a type-specific issue.",
      bullets: ["Use JSON Formatter for changed payload fields.", "Use Text Sort and Dedupe for unordered lists.", "Use Word Character Counter for length-sensitive copy."],
    },
  ],
  "json-yaml-csv-conversion": [
    {
      heading: "Identify the source shape before conversion",
      body: "JSON, YAML, and CSV represent structure differently. Before converting, identify whether the source is an object, list, table, nested config, or loose key-value block so the output can be checked against the right expectation.",
      bullets: ["JSON objects preserve nested keys clearly.", "YAML is readable but indentation-sensitive.", "CSV is tabular and loses nested structure unless encoded deliberately."],
    },
    {
      heading: "Protect arrays, nulls, and empty strings",
      body: "Many conversion mistakes involve arrays becoming strings, empty cells becoming missing fields, or null values becoming the text null. Review a small sample with edge cases before converting a long spreadsheet or config file.",
      bullets: ["Include one empty value in the test sample.", "Include one nested object or list if the real data has nesting.", "Check whether numeric IDs must remain strings."],
    },
    {
      heading: "Validate before and after conversion",
      body: "A successful conversion can still produce the wrong shape for the next tool. Validate YAML syntax, format JSON, preview CSV rows, and compare counts before trusting the copied output.",
      bullets: ["Compare row counts before and after CSV conversion.", "Check top-level keys after YAML to JSON conversion.", "Use JSON Schema when the target payload has required fields."],
    },
    {
      heading: "Use Docker Compose diagnostics inside YAML review",
      body: "Compose files need more than YAML syntax. Service names, images, build contexts, ports, volumes, environment keys, and dependencies should be inspected before the formatted output is copied into a project.",
      bullets: ["Check that service names are stable and readable.", "Review host ports for accidental conflicts.", "Confirm env values are examples, not production secrets."],
    },
    {
      heading: "Keep conversion tied to a practical workflow",
      body: "Data conversion is strongest when it connects to the next review step. Convert CSV to JSON for fixtures, JSON to TypeScript for API typing, YAML to JSON for schema inspection, or JSONPath for extracting one field.",
      bullets: ["Use CSV JSON Converter for spreadsheet exports.", "Use JSON to TypeScript after formatting a representative payload.", "Use JSONPath Tester when only one nested value is needed."],
    },
  ],
  "sql-formatting-workflow": [
    {
      heading: "Format for review, not for execution",
      body: "A SQL formatter makes a query easier to read, but it does not prove safety, performance, or correctness. Treat formatted SQL as a review artifact that still needs database-specific validation.",
      bullets: ["Check the dialect before trusting keyword layout.", "Keep literals redacted when sharing output.", "Review behavior in the real database before running mutations."],
    },
    {
      heading: "Read the query type first",
      body: "SELECT, INSERT, UPDATE, DELETE, ALTER, and DROP statements carry different risk. A formatter should make the query type, table references, joins, filters, limits, and subqueries easier to inspect.",
      bullets: ["Mutation queries need a WHERE review.", "SELECT queries need table, join, and limit review.", "Schema changes need an explicit migration process."],
    },
    {
      heading: "Use formatting to find missing clauses",
      body: "Compact SQL can hide a missing WHERE clause, cross join, broad wildcard, or unbounded query. After formatting, scan each clause in order and compare the output to the original input.",
      bullets: ["Check WHERE and LIMIT before sharing a data query.", "Check JOIN conditions for accidental cartesian results.", "Check subqueries for hidden filters or expensive scans."],
    },
    {
      heading: "Protect sensitive identifiers",
      body: "Queries often include customer IDs, emails, table names, tenant IDs, or internal schema details. Redact those values before using an online formatter in a ticket, chat, or public documentation.",
      bullets: ["Replace emails and IDs with stable placeholders.", "Keep table aliases if they are needed to understand joins.", "Avoid pasting real credentials in connection strings."],
    },
    {
      heading: "Compare query revisions with diff",
      body: "After formatting a query, Text Diff can show whether only whitespace changed or whether a condition moved. CSV conversion can help inspect query result samples without turning the SQL page into a database client.",
      bullets: ["Diff formatted before-and-after versions.", "Use CSV JSON Converter for small exported result samples.", "Use JSON Formatter when query results come from an API response."],
    },
  ],
  "color-contrast-checking": [
    {
      heading: "Check the real foreground and background pair",
      body: "Color conversion alone does not prove readability. Contrast must be checked against the actual background, state, font size, weight, and UI context where the color will appear.",
      bullets: ["Check normal text separately from large text.", "Test hover, focus, disabled, and selected states.", "Avoid judging transparent colors on a plain white background only."],
    },
    {
      heading: "Convert formats without losing intent",
      body: "HEX, RGB, and HSL can represent the same color, but teams often prefer one format for tokens, CSS variables, or design handoff. Copy the format that matches the codebase convention and document alpha limitations.",
      bullets: ["Use HEX for compact static tokens.", "Use RGB or HSL when components adjust channels.", "Review alpha values against the final rendered background."],
    },
    {
      heading: "Use WCAG thresholds as review signals",
      body: "AA and AAA thresholds help flag risky combinations, but they are not the entire accessibility review. Font size, text weight, icon meaning, motion, and focus visibility still need real interface checks.",
      bullets: ["AA normal text is stricter than AA large text.", "AAA is useful for high-trust or long-reading surfaces.", "Icons need labels or surrounding text when meaning is not obvious."],
    },
    {
      heading: "Avoid palette decisions from isolated swatches",
      body: "A single color can look strong in a swatch but fail when used for dense text, charts, borders, and backgrounds. Review luminance gaps and contrast warnings before turning a converted value into a design token.",
      bullets: ["Check neutral text on tinted surfaces.", "Check brand colors on both light and dark backgrounds.", "Use border and fill colors that maintain workbench separation."],
    },
    {
      heading: "Continue into CSS utilities when needed",
      body: "Color decisions often sit beside spacing, clamp values, and CSS cleanup. Use CSS Formatter, Unit Converter, and Clamp Generator after the color pair is readable so visual changes stay implementation-ready.",
      bullets: ["Format CSS before adding new color tokens.", "Convert units for spacing around colored elements.", "Use clamp only after fixed sizes are understood."],
    },
  ],
  "secure-generator-workflow": [
    {
      heading: "Choose the generated value by purpose",
      body: "Passwords, passphrases, random tokens, UUIDs, and ULIDs solve different problems. A strong workflow starts by deciding whether the value is a human credential, machine secret, public identifier, sortable identifier, or test fixture.",
      bullets: ["Use passwords or passphrases for accounts.", "Use random tokens for secret-like session, CSRF, or webhook values.", "Use UUIDs or ULIDs for identifiers, not secrets."],
    },
    {
      heading: "Configure length and format deliberately",
      body: "Generated output should match the system that will accept it. Character classes, separators, ambiguous character exclusion, byte length, Base64 padding, and URL-safe encoding all affect whether a copied value works.",
      bullets: ["Check target length limits before generating.", "Use URL-safe tokens for cookies, links, and query values.", "Use passphrases only when long values and separators are accepted."],
    },
    {
      heading: "Handle generated secrets after copying",
      body: "A strong value can still leak through clipboard history, screenshots, chat logs, or browser state. Store real credentials in a password manager or secret store immediately and regenerate values that were exposed.",
      bullets: ["Avoid pasting real secrets into shared tickets.", "Clear local history when working with sensitive drafts.", "Generate separate values for separate environments."],
    },
    {
      heading: "Use entropy as a signal, not a promise",
      body: "Entropy estimates help compare settings, but they do not cover storage, reuse, transport, or human handling. Pair the generated value with an operational rule for where it will live and how it will rotate.",
      bullets: ["Use longer tokens for machine-to-machine secrets.", "Use passphrases for human entry when policies allow.", "Rotate any value that appears in logs or screenshots."],
    },
    {
      heading: "Combine generators with validation tools",
      body: "Generated values often move into ENV files, JSON payloads, QR codes, or docs. Validate the surrounding format before copying the result into a deployment, credential manager, or test fixture.",
      bullets: ["ENV Parser catches duplicate or malformed variable lines.", "QR Code Generator can build Wi-Fi payloads from generated test values.", "Hash Generator can create checksums or HMAC drafts for test payloads."],
    },
  ],
  "web-seo-utilities": [
    {
      heading: "Treat crawl readiness as a workflow",
      body: "Robots.txt, sitemap XML, canonical URLs, meta tags, Open Graph previews, and favicons should describe the same public site structure. Fix reachability and duplication before changing titles or descriptions.",
      bullets: ["Robots rules should not block pages listed in the sitemap.", "Sitemap URLs should be final canonical URLs.", "Meta tags should match visible page content."],
    },
    {
      heading: "Validate public URLs before generating files",
      body: "A sitemap or robots file made from broken URLs can look syntactically valid while sending crawlers to redirects, private hosts, or duplicate pages. Use URL Parser and HTTP Status Checker before copying crawl files.",
      bullets: ["Reject localhost and private-host entries for public crawl files.", "Prefer HTTPS canonical URLs.", "Check apex and www redirect behavior separately."],
    },
    {
      heading: "Keep social preview data inspectable",
      body: "Open Graph title, description, URL, and image fields should help users recognize the page when it is shared. Broken image hosts, mismatched canonical URLs, and generic descriptions make the preview look unfinished.",
      bullets: ["Use public HTTPS image URLs.", "Keep preview text specific to the page task.", "Check image dimensions and file format before launch."],
    },
    {
      heading: "Use favicons as part of trust, not decoration",
      body: "A favicon helps users recognize a tab, bookmark, and browser history entry. It should be lightweight, stable, and aligned with the site identity rather than generated as a one-off experiment on every page.",
      bullets: ["Keep favicon markup simple and cache-friendly.", "Use consistent foreground and background colors.", "Check visibility in light and dark browser chrome."],
    },
    {
      heading: "Document the review result",
      body: "A crawl-readiness pass should end with concrete evidence: final 200 URLs, sitemap coverage, robots intent, canonical host behavior, and preview readiness. That evidence is stronger than broad SEO claims.",
      bullets: ["Save the canonical URL list used for checking.", "Record status codes and redirect chains.", "Keep visible page content aligned with metadata."],
    },
  ],
  "network-debugging-tools": [
    {
      heading: "Separate DNS, HTTP, and app behavior",
      body: "Public web failures often look similar from the browser, but DNS records, redirect chains, TLS, headers, and application responses fail at different layers. Check each layer before changing app code.",
      bullets: ["DNS tells you where a host points.", "HTTP status shows how the endpoint responds.", "Headers explain cache, redirect, frame, and security behavior."],
    },
    {
      heading: "Use only public hosts in server checks",
      body: "DNS and HTTP tools use server routes because browsers cannot perform those checks directly. The tradeoff is that inputs must be public URLs or public hostnames, not internal systems or private IP ranges.",
      bullets: ["Avoid localhost, private IPs, and reserved domains.", "Do not include credentials in URLs.", "Use internal tools for private infrastructure checks."],
    },
    {
      heading: "Trace redirect chains from the first URL",
      body: "A final 200 response can hide unnecessary hops, host changes, locale redirects, or protocol downgrades. Review every hop when debugging canonical domains, sitemap URLs, login callbacks, and SEO crawl paths.",
      bullets: ["Check apex to www behavior.", "Check HTTP to HTTPS behavior.", "Check whether locale or trailing-slash redirects are intentional."],
    },
    {
      heading: "Read DNS records by deployment intent",
      body: "A, AAAA, CNAME, NS, MX, and TXT records answer different operational questions. Match the record type to the deployment issue instead of treating DNS as one generic status.",
      bullets: ["A and AAAA records affect apex routing.", "CNAME commonly affects www or subdomains.", "TXT records often cover ownership, SPF, DKIM, and DMARC checks."],
    },
    {
      heading: "Move from signal to next action",
      body: "The goal of network debugging is not to collect raw output; it is to decide the next step. DNS mismatch, redirect drift, missing security headers, and cache confusion each point to a different owner.",
      bullets: ["Use DNS Lookup after a host cannot resolve.", "Use HTTP Status Checker after DNS points correctly.", "Use URL Parser when query strings or callbacks look wrong."],
    },
  ],
  "css-utility-workflow": [
    {
      heading: "Start with the layout constraint",
      body: "CSS formatting, minification, unit conversion, and clamp generation are useful only when the layout goal is clear. Identify the container width, breakpoint, root font size, and fixed elements before changing values.",
      bullets: ["Record root font size before px to rem conversion.", "Check container width before fluid clamp values.", "Keep media query context when formatting snippets."],
    },
    {
      heading: "Format before reviewing cascade behavior",
      body: "Readable CSS makes selectors, custom properties, at-rules, and duplicate blocks easier to inspect. Formatting does not change specificity, so still review whether the selector should win in the actual page.",
      bullets: ["Check duplicate selectors after formatting.", "Review ID selectors and deeply nested selectors.", "Keep custom properties attached to the right scope."],
    },
    {
      heading: "Minify only after preserving important comments",
      body: "Minification can remove comments, whitespace, and formatting that humans need for debugging. Do not minify source snippets that include license notes, handoff comments, or vendor-specific explanations unless those notes are preserved elsewhere.",
      bullets: ["Check comment-removal warnings.", "Compare compression ratio against readability needs.", "Use source files, not pasted snippets, for production build minification."],
    },
    {
      heading: "Use unit conversion with real context",
      body: "A px to rem conversion depends on root font size, and percentages depend on the containing block. A correct number copied into the wrong context can still break spacing, typography, or component alignment.",
      bullets: ["Convert spacing and typography separately.", "Do not scale font size directly with viewport width.", "Check mobile and desktop after changing unit strategy."],
    },
    {
      heading: "Pair CSS work with color and HTML checks",
      body: "CSS issues often sit beside color contrast, HTML structure, and JavaScript behavior. Use adjacent tools to check contrast, format markup, and inspect snippets before copying a final style block.",
      bullets: ["Use Color Converter for foreground/background pairs.", "Use HTML Formatter when selector context is unclear.", "Use JavaScript Formatter when class names are generated by code."],
    },
  ],
  "text-cleanup-workflow": [
    {
      heading: "Keep the original text available",
      body: "Sorting, deduping, case conversion, slug generation, and counting are easy to over-apply. Keep the original input nearby so you can verify that cleanup did not remove meaningful order, punctuation, or casing.",
      bullets: ["Copy the original to the before side of Text Diff.", "Check line counts after dedupe.", "Preserve casing when it carries product or code meaning."],
    },
    {
      heading: "Choose cleanup based on the destination",
      body: "Text headed for code, metadata, route slugs, CSV, Markdown, or UI labels needs different handling. The safest workflow starts with the destination and then chooses the smallest transformation.",
      bullets: ["Use slug generation for routes and filenames.", "Use case conversion for identifiers and headings.", "Use word counting for metadata and UI limits."],
    },
    {
      heading: "Sort and dedupe only when order is irrelevant",
      body: "Alphabetical sorting helps with allowlists, keyword lists, and repeated lines, but it can damage logs, prose, changelogs, and ordered instructions. Decide whether order is meaningful before cleaning a list.",
      bullets: ["Keep chronological logs in original order.", "Sort keyword or ID lists when order has no meaning.", "Dedupe only after confirming repeated lines are accidental."],
    },
    {
      heading: "Preview Markdown and table output",
      body: "Markdown tables and docs snippets can look correct in raw text while rendering poorly because of uneven columns, pipes, tabs, or escaped characters. Preview before copying into a README, issue, or CMS.",
      bullets: ["Check row and column counts.", "Escape pipes inside cell values.", "Use word and character counts for compact descriptions."],
    },
    {
      heading: "Use cleanup to improve public content quality",
      body: "Text tools are not only for code. They help remove duplicated boilerplate, normalize page headings, check metadata length, and keep guide copy specific enough to avoid thin repeated pages.",
      bullets: ["Count titles and descriptions before publishing.", "Diff repeated guide sections to find boilerplate.", "Use slug generation to keep URL names readable."],
    },
  ],
} satisfies Record<string, GuideSection[]>;

export const guides: GuideDefinition[] = [
  {
    slug: "regex-cheat-sheet",
    title: "Regex cheat sheet for practical JavaScript patterns",
    description: "Common JavaScript regular expression patterns, flags, and matching notes for day-to-day development.",
    relatedTools: ["regex-tester", "json-formatter", "url-encoder"],
    sections: guideSections["regex-cheat-sheet"],
  },
  {
    slug: "cron-expression-examples",
    title: "Cron expression examples and scheduling caveats",
    description: "A compact guide to common five-field cron schedules, time zone behavior, and Quartz differences.",
    relatedTools: ["cron-generator", "timestamp-converter", "timezone-converter"],
    sections: guideSections["cron-expression-examples"],
  },
  {
    slug: "seo-meta-tags",
    title: "SEO meta tags that are worth generating",
    description: "The metadata fields that usually matter for search snippets, social previews, and duplicate URL handling.",
    relatedTools: ["meta-tag-generator", "open-graph-preview", "sitemap-generator"],
    sections: guideSections["seo-meta-tags"],
  },
  {
    slug: "iframe-preview-limitations",
    title: "Iframe preview limitations developers should expect",
    description: "Why some pages refuse to render in iframes and how to interpret that failure during responsive testing.",
    relatedTools: ["iframe-viewer", "http-status-checker", "url-parser"],
    sections: guideSections["iframe-preview-limitations"],
  },
  {
    slug: "placeholder-text-for-design",
    title: "Placeholder text patterns for product design",
    description: "How to use dummy content without hiding layout, accessibility, and product copy problems.",
    relatedTools: ["lorem-ipsum-generator", "word-character-counter", "case-converter"],
    sections: guideSections["placeholder-text-for-design"],
  },
  {
    slug: "developer-utility-workflow",
    title: "A practical workflow for browser-based developer utilities",
    description: "A simple way to use local browser utilities while keeping sensitive payloads and production data safe.",
    relatedTools: ["json-formatter", "env-parser-validator", "jwt-decoder", "base64-tool"],
    sections: guideSections["developer-utility-workflow"],
  },
  {
    slug: "hash-generator-security",
    title: "Hash generator security notes",
    description: "How to use MD5, SHA-1, SHA-256, and SHA-512 outputs without confusing hashing with encryption.",
    relatedTools: ["hash-generator", "base64-tool", "random-token-generator"],
    sections: guideSections["hash-generator-security"],
  },
  {
    slug: "text-diff-for-developers",
    title: "Text diff workflow for developers",
    description: "A practical way to compare snippets, config changes, logs, and payload revisions.",
    relatedTools: ["text-diff", "text-sort-dedupe", "json-formatter"],
    sections: guideSections["text-diff-for-developers"],
  },
  {
    slug: "json-yaml-csv-conversion",
    title: "JSON, YAML, and CSV conversion workflow",
    description: "How to move data between common formats while preserving structure and validating output.",
    relatedTools: ["json-formatter", "yaml-validator", "yaml-json-converter", "csv-json-converter"],
    sections: guideSections["json-yaml-csv-conversion"],
  },
  {
    slug: "sql-formatting-workflow",
    title: "SQL formatting workflow",
    description: "How to format SQL queries for review, debugging, and readable diffs.",
    relatedTools: ["sql-formatter", "text-diff", "csv-json-converter"],
    sections: guideSections["sql-formatting-workflow"],
  },
  {
    slug: "color-contrast-checking",
    title: "Color conversion and contrast checking",
    description: "Use HEX, RGB, HSL, and contrast ratios to keep interface colors readable.",
    relatedTools: ["color-converter", "css-unit-converter", "css-clamp-generator"],
    sections: guideSections["color-contrast-checking"],
  },
  {
    slug: "secure-generator-workflow",
    title: "Secure random generator workflow",
    description: "How to generate passwords, tokens, UUIDs, and ULIDs for local development without overclaiming security.",
    relatedTools: ["password-generator", "random-token-generator", "uuid-generator", "ulid-generator"],
    sections: guideSections["secure-generator-workflow"],
  },
  {
    slug: "web-seo-utilities",
    title: "Practical web and SEO utilities",
    description: "A compact workflow for robots.txt, sitemaps, favicons, URL parsing, and social previews.",
    relatedTools: ["robots-txt-generator", "sitemap-generator", "open-graph-preview", "favicon-generator"],
    sections: guideSections["web-seo-utilities"],
  },
  {
    slug: "network-debugging-tools",
    title: "Network debugging tools workflow",
    description: "How to use HTTP status checks and DNS lookups for public web debugging.",
    relatedTools: ["http-status-checker", "dns-lookup", "url-parser"],
    sections: guideSections["network-debugging-tools"],
  },
  {
    slug: "css-utility-workflow",
    title: "CSS utility workflow",
    description: "Use CSS formatting, minification, unit conversion, and clamp values for layout work.",
    relatedTools: ["css-formatter", "css-minifier", "css-unit-converter", "css-clamp-generator"],
    sections: guideSections["css-utility-workflow"],
  },
  {
    slug: "text-cleanup-workflow",
    title: "Text cleanup workflow",
    description: "Sort, dedupe, count, preview, and normalize text before using it in code or content systems.",
    relatedTools: ["case-converter", "slug-generator", "text-sort-dedupe", "word-character-counter"],
    sections: guideSections["text-cleanup-workflow"],
  },
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
