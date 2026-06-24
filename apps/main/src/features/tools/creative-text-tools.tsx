"use client";

import * as React from "react";
import { Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ClientDictionary } from "@/features/i18n/dictionaries";
import { cn } from "@/lib/utils";

function copyToClipboard(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    void navigator.clipboard.writeText(value);
  }
}

function ui(dictionary: ClientDictionary, key: string, fallback: string) {
  return dictionary.toolUi[key] ?? fallback;
}

function characterCount(value: string) {
  return Array.from(value).length;
}

function codePointLabel(value: string) {
  return Array.from(value)
    .map((character) => `U+${(character.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, "0")}`)
    .join(" ");
}

function CreativeMetricGrid({ items }: { items: Array<{ label: string; value: string; description?: string }> }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4" data-tool-metric-grid>
      {items.map((item) => (
        <div key={item.label} className="bobob-diagnostic-card min-w-0 rounded-md border bg-card p-3">
          <p className="text-xs text-muted-foreground">{item.label}</p>
          <p className="mt-1 break-words text-sm font-semibold">{item.value}</p>
          {item.description ? <p className="mt-1 text-xs text-muted-foreground">{item.description}</p> : null}
        </div>
      ))}
    </div>
  );
}

function CreativeWarningList({ title, warnings, emptyLabel }: { title: string; warnings: string[]; emptyLabel: string }) {
  return (
    <section className="bobob-diagnostic-list rounded-md border bg-card p-3" data-tool-warning-list>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
        {(warnings.length ? warnings : [emptyLabel]).map((warning) => (
          <li key={warning} className="break-words">
            {warning}
          </li>
        ))}
      </ul>
    </section>
  );
}

function CreativeResultBlock({
  title,
  value,
  dictionary,
  description,
}: {
  title: string;
  value: string;
  dictionary: ClientDictionary;
  description?: string;
}) {
  return (
    <Card className="bobob-tool-result-card overflow-hidden border-2" data-tool-output-block>
      <CardHeader className="border-b bg-muted/35 p-4">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <Badge className="mb-2">{ui(dictionary, "output", "Output")}</Badge>
            <CardTitle className="break-words">{title}</CardTitle>
            <CardDescription>{description ?? ui(dictionary, "copyReadyOutput", "Copy-ready output")}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(value)} className="shrink-0">
            <Copy className="h-4 w-4" />
            {dictionary.tool.copy}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="bg-background p-4">
        <pre className="max-h-96 max-w-full overflow-auto whitespace-pre-wrap break-words rounded-md border bg-muted/70 p-3 text-xs leading-relaxed text-foreground">
          <code className="break-words">{value || dictionary.tool.noOutput}</code>
        </pre>
      </CardContent>
    </Card>
  );
}

const symbolCategories = [
  { id: "arrows", labelKey: "symbolCategoryArrows", fallback: "Arrows", symbols: ["←", "↑", "→", "↓", "↔", "↕", "↗", "↘", "⇄", "⇅", "⇒", "⇐", "⟶", "⟵", "⤴", "⤵"] },
  { id: "math", labelKey: "symbolCategoryMath", fallback: "Math", symbols: ["±", "×", "÷", "≈", "≠", "≤", "≥", "∞", "√", "∑", "∏", "∫", "∂", "∆", "π", "Ω"] },
  { id: "currency", labelKey: "symbolCategoryCurrency", fallback: "Currency", symbols: ["$", "€", "£", "¥", "₩", "₹", "₽", "₺", "₫", "¢", "₴", "₱", "₦", "₡", "₪", "₭"] },
  { id: "brackets", labelKey: "symbolCategoryBrackets", fallback: "Brackets", symbols: ["〈", "〉", "《", "》", "「", "」", "『", "』", "【", "】", "〔", "〕", "〖", "〗", "«", "»"] },
  { id: "shapes", labelKey: "symbolCategoryShapes", fallback: "Shapes", symbols: ["■", "□", "▣", "▢", "◆", "◇", "●", "○", "◐", "◑", "▲", "△", "▼", "▽", "✦", "✧"] },
  { id: "stars", labelKey: "symbolCategoryStars", fallback: "Stars", symbols: ["★", "☆", "✩", "✪", "✭", "✮", "✯", "✰", "✶", "✷", "✸", "✹", "✺", "✻", "✼", "✽"] },
  { id: "lines", labelKey: "symbolCategoryLines", fallback: "Lines", symbols: ["─", "━", "│", "┃", "┌", "┐", "└", "┘", "├", "┤", "┬", "┴", "┼", "╭", "╮", "╯", "╰"] },
] as const;

export function SpecialCharacterPickerTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [categoryId, setCategoryId] = React.useState<(typeof symbolCategories)[number]["id"]>("arrows");
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState("→ ✓ ★");
  const activeCategory = symbolCategories.find((category) => category.id === categoryId) ?? symbolCategories[0];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredSymbols = activeCategory.symbols.filter((symbol) => {
    if (!normalizedQuery) return true;
    return symbol.toLowerCase().includes(normalizedQuery) || codePointLabel(symbol).toLowerCase().includes(normalizedQuery);
  });
  const selectedCharacters = Array.from(selected).filter((character) => character.trim());
  const uniqueSelected = new Set(selectedCharacters);
  const warnings = [
    selected.trim() ? "" : ui(dictionary, "symbolEmptyWarning", "Pick symbols before copying."),
    selected.includes("\uFE0F") ? ui(dictionary, "symbolVariationWarning", "Emoji variation selectors can render differently across platforms.") : "",
    characterCount(selected) > 80 ? ui(dictionary, "symbolLongWarning", "Long symbol strings can wrap unpredictably in bios, titles, and chat fields.") : "",
    ui(dictionary, "symbolPlatformWarning", "Confirm the target app uses a font that supports these symbols before publishing."),
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <section className="rounded-md border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(12rem,16rem)]">
          <div>
            <label className="text-sm font-medium" htmlFor="symbol-search">
              {ui(dictionary, "symbolSearch", "Search symbols")}
            </label>
            <Input id="symbol-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="U+2192, arrow, ★" className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="symbol-category">
              {ui(dictionary, "specialCharacterCategories", "Symbol categories")}
            </label>
            <Select id="symbol-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value as typeof categoryId)} className="mt-2">
              {symbolCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {ui(dictionary, category.labelKey, category.fallback)}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-8 gap-2 sm:grid-cols-12">
          {filteredSymbols.map((symbol) => (
            <button
              key={symbol}
              type="button"
              aria-label={`${ui(dictionary, "append", "Append")} ${symbol} ${codePointLabel(symbol)}`}
              title={codePointLabel(symbol)}
              onClick={() => setSelected((value) => `${value}${value ? " " : ""}${symbol}`)}
              className="flex aspect-square min-h-9 items-center justify-center rounded-md border bg-background text-lg transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {symbol}
            </button>
          ))}
        </div>
      </section>
      <section className="rounded-md border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-sm font-medium" htmlFor="selected-symbols">
            {ui(dictionary, "selectedSymbols", "Selected symbols")}
          </label>
          <Button variant="outline" size="sm" onClick={() => setSelected("")}>
            {ui(dictionary, "clear", "Clear")}
          </Button>
        </div>
        <Textarea id="selected-symbols" value={selected} onChange={(event) => setSelected(event.target.value)} className="mt-2 min-h-24 font-mono text-base" />
      </section>
      <CreativeMetricGrid
        items={[
          { label: ui(dictionary, "characters", "Characters"), value: String(characterCount(selected)) },
          { label: ui(dictionary, "uniqueSymbols", "Unique symbols"), value: String(uniqueSelected.size) },
          { label: ui(dictionary, "codePoints", "Code points"), value: selectedCharacters.slice(0, 5).map(codePointLabel).join(", ") || "-" },
          { label: ui(dictionary, "symbols", "Symbols"), value: String(selectedCharacters.length) },
        ]}
      />
      <CreativeWarningList title={ui(dictionary, "symbolReviewNotes", "Symbol review notes")} warnings={warnings} emptyLabel={ui(dictionary, "symbolNoWarnings", "Symbols look ready to copy. Still verify rendering in the destination app.")} />
      <CreativeResultBlock title={ui(dictionary, "selectedSymbols", "Selected symbols")} value={selected} dictionary={dictionary} />
    </div>
  );
}

const asciiFont: Record<string, string[]> = {
  A: [" ### ", "#   #", "#####", "#   #", "#   #"],
  B: ["#### ", "#   #", "#### ", "#   #", "#### "],
  C: [" ####", "#    ", "#    ", "#    ", " ####"],
  D: ["#### ", "#   #", "#   #", "#   #", "#### "],
  E: ["#####", "#    ", "#### ", "#    ", "#####"],
  F: ["#####", "#    ", "#### ", "#    ", "#    "],
  G: [" ####", "#    ", "#  ##", "#   #", " ####"],
  H: ["#   #", "#   #", "#####", "#   #", "#   #"],
  I: ["#####", "  #  ", "  #  ", "  #  ", "#####"],
  J: ["#####", "   # ", "   # ", "#  # ", " ##  "],
  K: ["#   #", "#  # ", "###  ", "#  # ", "#   #"],
  L: ["#    ", "#    ", "#    ", "#    ", "#####"],
  M: ["#   #", "## ##", "# # #", "#   #", "#   #"],
  N: ["#   #", "##  #", "# # #", "#  ##", "#   #"],
  O: [" ### ", "#   #", "#   #", "#   #", " ### "],
  P: ["#### ", "#   #", "#### ", "#    ", "#    "],
  Q: [" ### ", "#   #", "#   #", "#  ##", " ####"],
  R: ["#### ", "#   #", "#### ", "#  # ", "#   #"],
  S: [" ####", "#    ", " ### ", "    #", "#### "],
  T: ["#####", "  #  ", "  #  ", "  #  ", "  #  "],
  U: ["#   #", "#   #", "#   #", "#   #", " ### "],
  V: ["#   #", "#   #", "#   #", " # # ", "  #  "],
  W: ["#   #", "#   #", "# # #", "## ##", "#   #"],
  X: ["#   #", " # # ", "  #  ", " # # ", "#   #"],
  Y: ["#   #", " # # ", "  #  ", "  #  ", "  #  "],
  Z: ["#####", "   # ", "  #  ", " #   ", "#####"],
  "0": [" ### ", "#  ##", "# # #", "##  #", " ### "],
  "1": ["  #  ", " ##  ", "  #  ", "  #  ", "#####"],
  "2": [" ### ", "#   #", "   # ", "  #  ", "#####"],
  "3": ["#### ", "    #", " ### ", "    #", "#### "],
  "4": ["#   #", "#   #", "#####", "    #", "    #"],
  "5": ["#####", "#    ", "#### ", "    #", "#### "],
  "6": [" ####", "#    ", "#### ", "#   #", " ### "],
  "7": ["#####", "   # ", "  #  ", " #   ", "#    "],
  "8": [" ### ", "#   #", " ### ", "#   #", " ### "],
  "9": [" ### ", "#   #", " ####", "    #", " ### "],
  "?": [" ### ", "#   #", "   # ", "     ", "  #  "],
  "!": ["  #  ", "  #  ", "  #  ", "     ", "  #  "],
  " ": ["   ", "   ", "   ", "   ", "   "],
};

const asciiStyles = [
  { id: "hash", labelKey: "asciiStyleHash", fallback: "Hash", fill: "#", blank: " " },
  { id: "block", labelKey: "asciiStyleBlock", fallback: "Block", fill: "█", blank: " " },
  { id: "dots", labelKey: "asciiStyleDots", fallback: "Dots", fill: "●", blank: " " },
] as const;

function renderAsciiArt(input: string, fill: string, blank: string) {
  const lines = ["", "", "", "", ""];
  let unsupported = 0;
  for (const character of input.toUpperCase()) {
    const glyph = asciiFont[character] ?? asciiFont["?"];
    if (!asciiFont[character]) unsupported += 1;
    glyph.forEach((row, index) => {
      lines[index] += `${row.replaceAll("#", fill).replaceAll(" ", blank)} `;
    });
  }
  return { output: lines.map((line) => line.trimEnd()).join("\n"), unsupported };
}

export function AsciiArtGeneratorTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState("BOB");
  const [styleId, setStyleId] = React.useState<(typeof asciiStyles)[number]["id"]>("hash");
  const style = asciiStyles.find((item) => item.id === styleId) ?? asciiStyles[0];
  const { output, unsupported } = React.useMemo(() => renderAsciiArt(input, style.fill, style.blank), [input, style]);
  const rows = output ? output.split("\n") : [];
  const columns = rows.reduce((max, row) => Math.max(max, row.length), 0);
  const warnings = [
    input.trim() ? "" : ui(dictionary, "asciiEmptyWarning", "Enter text before generating ASCII art."),
    unsupported ? ui(dictionary, "asciiUnsupportedWarning", "Unsupported characters were replaced with question marks.") : "",
    columns > 80 ? ui(dictionary, "asciiWideWarning", "This art is wide and may wrap in narrow chat, profile, or comment fields.") : "",
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <section className="rounded-md border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(12rem,16rem)]">
          <div>
            <label className="text-sm font-medium" htmlFor="ascii-input">
              {ui(dictionary, "asciiTextInput", "ASCII text input")}
            </label>
            <Input id="ascii-input" value={input} onChange={(event) => setInput(event.target.value.slice(0, 24))} className="mt-2 font-mono" />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="ascii-style">
              {ui(dictionary, "asciiStyle", "ASCII style")}
            </label>
            <Select id="ascii-style" value={styleId} onChange={(event) => setStyleId(event.target.value as typeof styleId)} className="mt-2">
              {asciiStyles.map((item) => (
                <option key={item.id} value={item.id}>
                  {ui(dictionary, item.labelKey, item.fallback)}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </section>
      <CreativeMetricGrid
        items={[
          { label: ui(dictionary, "asciiRows", "Rows"), value: String(rows.length) },
          { label: ui(dictionary, "asciiColumns", "Columns"), value: String(columns) },
          { label: ui(dictionary, "unsupportedCharacters", "Unsupported characters"), value: String(unsupported) },
          { label: ui(dictionary, "characters", "Characters"), value: String(characterCount(input)) },
        ]}
      />
      <CreativeWarningList title={ui(dictionary, "asciiReviewNotes", "ASCII review notes")} warnings={warnings} emptyLabel={ui(dictionary, "asciiNoWarnings", "ASCII art looks ready to copy. Preview it in the target app before publishing.")} />
      <CreativeResultBlock title={ui(dictionary, "asciiGeneratedArt", "Generated ASCII art")} value={output} dictionary={dictionary} />
    </div>
  );
}

const dotPresets = [
  {
    id: "heart",
    labelKey: "dotPresetHeart",
    fallback: "Heart",
    rows: ["01100110", "11111111", "11111111", "01111110", "00111100", "00011000"],
  },
  {
    id: "smile",
    labelKey: "dotPresetSmile",
    fallback: "Smile",
    rows: ["00111100", "01000010", "10100101", "10000001", "10100101", "10011001", "01000010", "00111100"],
  },
  {
    id: "arrow",
    labelKey: "dotPresetArrow",
    fallback: "Arrow",
    rows: ["00010000", "00011000", "11111100", "11111110", "11111100", "00011000", "00010000"],
  },
  {
    id: "check",
    labelKey: "dotPresetCheck",
    fallback: "Check",
    rows: ["00000001", "00000011", "10000110", "11001100", "01111000", "00110000"],
  },
] as const;

const dotPalettes = [
  { id: "circle", labelKey: "dotPaletteCircle", fallback: "Circle", filled: "●", empty: "○" },
  { id: "block", labelKey: "dotPaletteBlock", fallback: "Block", filled: "█", empty: "░" },
  { id: "square", labelKey: "dotPaletteSquare", fallback: "Square", filled: "■", empty: "□" },
] as const;

function gridFromRows(rows: readonly string[]) {
  return rows.map((row) => Array.from(row).map((cell) => cell === "1"));
}

function resizeGrid(grid: boolean[][], nextRows: number, nextColumns: number) {
  return Array.from({ length: nextRows }, (_, rowIndex) =>
    Array.from({ length: nextColumns }, (_, columnIndex) => Boolean(grid[rowIndex]?.[columnIndex])),
  );
}

function clampGridSize(value: number) {
  if (!Number.isFinite(value)) return 8;
  return Math.max(4, Math.min(24, Math.trunc(value)));
}

export function DotArtEditorTool({ dictionary }: { dictionary: ClientDictionary }) {
  const initialGrid = React.useMemo(() => gridFromRows(dotPresets[0].rows), []);
  const [grid, setGrid] = React.useState(initialGrid);
  const [paletteId, setPaletteId] = React.useState<(typeof dotPalettes)[number]["id"]>("circle");
  const rows = grid.length;
  const columns = grid[0]?.length ?? 0;
  const palette = dotPalettes.find((item) => item.id === paletteId) ?? dotPalettes[0];
  const filledCount = grid.flat().filter(Boolean).length;
  const totalCells = rows * columns;
  const density = totalCells ? Math.round((filledCount / totalCells) * 100) : 0;
  const output = grid.map((row) => row.map((filled) => (filled ? palette.filled : palette.empty)).join("")).join("\n");
  const warnings = [
    filledCount ? "" : ui(dictionary, "dotEmptyWarning", "Fill at least one cell before copying dot art."),
    columns > 18 ? ui(dictionary, "dotWideWarning", "Wide dot art can wrap on mobile profile and comment fields.") : "",
    density > 70 ? ui(dictionary, "dotDenseWarning", "Dense dot art can look like a solid block on some fonts.") : "",
  ].filter(Boolean);

  const setRows = (value: number) => setGrid((current) => resizeGrid(current, clampGridSize(value), columns || 8));
  const setColumns = (value: number) => setGrid((current) => resizeGrid(current, rows || 8, clampGridSize(value)));
  const applyPreset = (preset: (typeof dotPresets)[number]) => setGrid(gridFromRows(preset.rows));

  return (
    <div className="space-y-4">
      <section className="rounded-md border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium" htmlFor="dot-rows">
              {ui(dictionary, "dotRows", "Rows")}
            </label>
            <Input id="dot-rows" type="number" min={4} max={24} value={rows} onChange={(event) => setRows(Number(event.target.value))} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="dot-columns">
              {ui(dictionary, "dotColumns", "Columns")}
            </label>
            <Input id="dot-columns" type="number" min={4} max={24} value={columns} onChange={(event) => setColumns(Number(event.target.value))} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="dot-palette">
              {ui(dictionary, "dotPalette", "Dot palette")}
            </label>
            <Select id="dot-palette" value={paletteId} onChange={(event) => setPaletteId(event.target.value as typeof paletteId)} className="mt-2">
              {dotPalettes.map((item) => (
                <option key={item.id} value={item.id}>
                  {ui(dictionary, item.labelKey, item.fallback)}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {dotPresets.map((preset) => (
            <Button key={preset.id} type="button" variant="outline" size="sm" onClick={() => applyPreset(preset)}>
              {ui(dictionary, preset.labelKey, preset.fallback)}
            </Button>
          ))}
        </div>
        <div className="mt-4 overflow-auto rounded-md border bg-muted/30 p-3">
          <div className="grid max-w-full gap-1" style={{ gridTemplateColumns: `repeat(${columns}, minmax(1.6rem, 1fr))` }}>
            {grid.map((row, rowIndex) =>
              row.map((filled, columnIndex) => (
                <button
                  key={`${rowIndex}-${columnIndex}`}
                  type="button"
                  aria-label={`${rowIndex + 1},${columnIndex + 1}`}
                  onClick={() =>
                    setGrid((current) =>
                      current.map((gridRow, currentRow) =>
                        gridRow.map((cell, currentColumn) => (currentRow === rowIndex && currentColumn === columnIndex ? !cell : cell)),
                      ),
                    )
                  }
                  className={cn(
                    "aspect-square min-h-7 rounded-sm border text-sm leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    filled ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  {filled ? palette.filled : palette.empty}
                </button>
              )),
            )}
          </div>
        </div>
      </section>
      <CreativeMetricGrid
        items={[
          { label: ui(dictionary, "dotRows", "Rows"), value: String(rows) },
          { label: ui(dictionary, "dotColumns", "Columns"), value: String(columns) },
          { label: ui(dictionary, "dotFilledCells", "Filled cells"), value: String(filledCount) },
          { label: ui(dictionary, "dotDensity", "Density"), value: `${density}%` },
        ]}
      />
      <CreativeWarningList title={ui(dictionary, "dotReviewNotes", "Dot art review notes")} warnings={warnings} emptyLabel={ui(dictionary, "dotNoWarnings", "Dot art looks ready to copy. Test it in the destination font before publishing.")} />
      <CreativeResultBlock title={ui(dictionary, "dotGeneratedArt", "Generated dot art")} value={output} dictionary={dictionary} />
    </div>
  );
}

const fullwidthOffset = 0xfee0;
const circledNumbers = ["⓪", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"];
const smallCapsMap: Record<string, string> = {
  a: "ᴀ",
  b: "ʙ",
  c: "ᴄ",
  d: "ᴅ",
  e: "ᴇ",
  f: "ꜰ",
  g: "ɢ",
  h: "ʜ",
  i: "ɪ",
  j: "ᴊ",
  k: "ᴋ",
  l: "ʟ",
  m: "ᴍ",
  n: "ɴ",
  o: "ᴏ",
  p: "ᴘ",
  q: "ǫ",
  r: "ʀ",
  s: "ꜱ",
  t: "ᴛ",
  u: "ᴜ",
  v: "ᴠ",
  w: "ᴡ",
  x: "x",
  y: "ʏ",
  z: "ᴢ",
};

const fancyStyles = [
  { id: "fullwidth", labelKey: "fancyStyleFullwidth", fallback: "Fullwidth" },
  { id: "bold", labelKey: "fancyStyleBold", fallback: "Bold Unicode" },
  { id: "monospace", labelKey: "fancyStyleMonospace", fallback: "Monospace" },
  { id: "circled", labelKey: "fancyStyleCircled", fallback: "Circled" },
  { id: "smallcaps", labelKey: "fancyStyleSmallCaps", fallback: "Small caps" },
] as const;

function mathAlphabetTransform(character: string, upperBase: number, lowerBase: number, digitBase: number) {
  const code = character.codePointAt(0) ?? 0;
  if (code >= 65 && code <= 90) return String.fromCodePoint(upperBase + code - 65);
  if (code >= 97 && code <= 122) return String.fromCodePoint(lowerBase + code - 97);
  if (code >= 48 && code <= 57) return String.fromCodePoint(digitBase + code - 48);
  return character;
}

function transformFancyText(value: string, styleId: (typeof fancyStyles)[number]["id"]) {
  return Array.from(value)
    .map((character) => {
      const code = character.codePointAt(0) ?? 0;
      if (styleId === "fullwidth") {
        if (character === " ") return "　";
        if (code >= 33 && code <= 126) return String.fromCodePoint(code + fullwidthOffset);
        return character;
      }
      if (styleId === "bold") return mathAlphabetTransform(character, 0x1d400, 0x1d41a, 0x1d7ce);
      if (styleId === "monospace") return mathAlphabetTransform(character, 0x1d670, 0x1d68a, 0x1d7f6);
      if (styleId === "circled") {
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x24b6 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x24d0 + code - 97);
        if (code >= 48 && code <= 57) return circledNumbers[code - 48];
        return character;
      }
      if (styleId === "smallcaps") return smallCapsMap[character.toLowerCase()] ?? character;
      return character;
    })
    .join("");
}

export function FancyTextGeneratorTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState("Bobob is fun");
  const [styleId, setStyleId] = React.useState<(typeof fancyStyles)[number]["id"]>("fullwidth");
  const output = React.useMemo(() => transformFancyText(input, styleId), [input, styleId]);
  const variantOutputs = React.useMemo(
    () =>
      fancyStyles.map((style) => ({
        ...style,
        label: ui(dictionary, style.labelKey, style.fallback),
        value: transformFancyText(input, style.id),
      })),
    [dictionary, input],
  );
  const changedCount = Array.from(input).filter((character, index) => Array.from(output)[index] !== character).length;
  const warnings = [
    input.trim() ? "" : ui(dictionary, "playfulEmptyWarning", "Enter text before copying a generated result."),
    changedCount < characterCount(input) ? ui(dictionary, "playfulUnsupportedWarning", "Some characters may stay unchanged because Unicode has no matching decorative form.") : "",
    characterCount(output) > 80 ? ui(dictionary, "playfulLongWarning", "Long decorative text can wrap in bios, names, captions, and chat fields.") : "",
    ui(dictionary, "playfulPlatformWarning", "Preview decorative Unicode in the target app because fonts differ by platform."),
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <section className="rounded-md border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(12rem,16rem)]">
          <div>
            <label className="text-sm font-medium" htmlFor="fancy-input">
              {ui(dictionary, "sourceText", "Source text")}
            </label>
            <Input id="fancy-input" value={input} onChange={(event) => setInput(event.target.value.slice(0, 120))} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="fancy-style">
              {ui(dictionary, "mode", "Mode")}
            </label>
            <Select id="fancy-style" value={styleId} onChange={(event) => setStyleId(event.target.value as typeof styleId)} className="mt-2">
              {fancyStyles.map((style) => (
                <option key={style.id} value={style.id}>
                  {ui(dictionary, style.labelKey, style.fallback)}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </section>
      <CreativeMetricGrid
        items={[
          { label: ui(dictionary, "characters", "Characters"), value: String(characterCount(input)) },
          { label: ui(dictionary, "generatedCharacters", "Generated characters"), value: String(characterCount(output)) },
          { label: ui(dictionary, "changedCharacters", "Changed characters"), value: String(changedCount) },
          { label: ui(dictionary, "codePoints", "Code points"), value: Array.from(output).slice(0, 4).map(codePointLabel).join(", ") || "-" },
        ]}
      />
      <CreativeWarningList title={ui(dictionary, "playfulReviewNotes", "Copy-paste review notes")} warnings={warnings} emptyLabel={ui(dictionary, "playfulNoWarnings", "This output looks ready to copy. Still check it in the target app.")} />
      <section className="rounded-md border bg-card p-4" data-tool-output-block>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">{ui(dictionary, "fancyVariantOutputs", "Style variants")}</h3>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{ui(dictionary, "fancyVariantDescription", "Compare every generated Unicode style and copy the one that fits the destination field.")}</p>
          </div>
          <Badge>{variantOutputs.length} {ui(dictionary, "generatedVariants", "Generated variants")}</Badge>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {variantOutputs.map((variant) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => copyToClipboard(variant.value)}
              className={cn(
                "min-w-0 rounded-md border bg-background p-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                styleId === variant.id ? "border-foreground" : "border-border",
              )}
            >
              <span className="flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
                <span>{variant.label}</span>
                <Copy className="h-3.5 w-3.5 shrink-0" />
              </span>
              <span className="mt-2 block min-h-8 break-words text-sm leading-6 text-foreground">{variant.value || dictionary.tool.noOutput}</span>
            </button>
          ))}
        </div>
      </section>
      <CreativeResultBlock title={ui(dictionary, "generatedText", "Generated text")} value={output} dictionary={dictionary} />
    </div>
  );
}

const upsideDownMap: Record<string, string> = {
  a: "ɐ",
  b: "q",
  c: "ɔ",
  d: "p",
  e: "ǝ",
  f: "ɟ",
  g: "ƃ",
  h: "ɥ",
  i: "ᴉ",
  j: "ɾ",
  k: "ʞ",
  l: "ʃ",
  m: "ɯ",
  n: "u",
  o: "o",
  p: "d",
  q: "b",
  r: "ɹ",
  s: "s",
  t: "ʇ",
  u: "n",
  v: "ʌ",
  w: "ʍ",
  x: "x",
  y: "ʎ",
  z: "z",
  A: "∀",
  B: "𐐒",
  C: "Ɔ",
  D: "ᗡ",
  E: "Ǝ",
  F: "Ⅎ",
  G: "⅁",
  H: "H",
  I: "I",
  J: "ſ",
  K: "ʞ",
  L: "˥",
  M: "W",
  N: "N",
  O: "O",
  P: "Ԁ",
  Q: "Ό",
  R: "ᴚ",
  S: "S",
  T: "⊥",
  U: "∩",
  V: "Λ",
  W: "M",
  X: "X",
  Y: "⅄",
  Z: "Z",
  "0": "0",
  "1": "Ɩ",
  "2": "ᄅ",
  "3": "Ɛ",
  "4": "ㄣ",
  "5": "ϛ",
  "6": "9",
  "7": "ㄥ",
  "8": "8",
  "9": "6",
  ".": "˙",
  ",": "'",
  "'": ",",
  "\"": "„",
  "!": "¡",
  "?": "¿",
  "(": ")",
  ")": "(",
  "[": "]",
  "]": "[",
  "{": "}",
  "}": "{",
};

function flipText(value: string, reverse: boolean) {
  const characters = Array.from(value).map((character) => upsideDownMap[character] ?? character);
  return (reverse ? characters.reverse() : characters).join("");
}

export function UpsideDownTextTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState("surprise your friends");
  const [mode, setMode] = React.useState("upside-reverse");
  const output = React.useMemo(() => {
    if (mode === "reverse") return Array.from(input).reverse().join("");
    if (mode === "upside") return flipText(input, false);
    return flipText(input, true);
  }, [input, mode]);
  const unsupported = Array.from(input).filter((character) => !upsideDownMap[character] && character.trim()).length;
  const warnings = [
    input.trim() ? "" : ui(dictionary, "playfulEmptyWarning", "Enter text before copying a generated result."),
    unsupported ? ui(dictionary, "playfulUnsupportedWarning", "Some characters may stay unchanged because Unicode has no matching decorative form.") : "",
    ui(dictionary, "upsideDownReadabilityWarning", "Upside-down text is playful, but long sentences can become hard to read."),
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <section className="rounded-md border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(12rem,16rem)]">
          <div>
            <label className="text-sm font-medium" htmlFor="upside-input">
              {ui(dictionary, "sourceText", "Source text")}
            </label>
            <Textarea id="upside-input" value={input} onChange={(event) => setInput(event.target.value.slice(0, 180))} className="mt-2 min-h-24" />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="upside-mode">
              {ui(dictionary, "mode", "Mode")}
            </label>
            <Select id="upside-mode" value={mode} onChange={(event) => setMode(event.target.value)} className="mt-2">
              <option value="upside-reverse">{ui(dictionary, "upsideModeReverse", "Upside down + reversed")}</option>
              <option value="upside">{ui(dictionary, "upsideModePlain", "Upside down")}</option>
              <option value="reverse">{ui(dictionary, "upsideModeBackwards", "Backwards")}</option>
            </Select>
          </div>
        </div>
      </section>
      <CreativeMetricGrid
        items={[
          { label: ui(dictionary, "characters", "Characters"), value: String(characterCount(input)) },
          { label: ui(dictionary, "unsupportedCharacters", "Unsupported characters"), value: String(unsupported) },
          { label: ui(dictionary, "generatedCharacters", "Generated characters"), value: String(characterCount(output)) },
          { label: ui(dictionary, "lines", "Lines"), value: String(output.split("\n").length) },
        ]}
      />
      <CreativeWarningList title={ui(dictionary, "playfulReviewNotes", "Copy-paste review notes")} warnings={warnings} emptyLabel={ui(dictionary, "playfulNoWarnings", "This output looks ready to copy. Still check it in the target app.")} />
      <CreativeResultBlock title={ui(dictionary, "generatedText", "Generated text")} value={output} dictionary={dictionary} />
    </div>
  );
}

const memeModes = [
  { id: "mocking", labelKey: "memeModeMocking", fallback: "Mocking case" },
  { id: "clap", labelKey: "memeModeClap", fallback: "Clap text" },
  { id: "sparkle", labelKey: "memeModeSparkle", fallback: "Sparkle words" },
  { id: "uwu", labelKey: "memeModeUwu", fallback: "Soft uwu" },
  { id: "warning", labelKey: "memeModeWarning", fallback: "Warning label" },
] as const;

function transformMemeText(input: string, mode: (typeof memeModes)[number]["id"]) {
  if (mode === "clap") return input.trim().split(/\s+/).filter(Boolean).join(" 👏 ");
  if (mode === "sparkle") return input.trim().split(/\s+/).filter(Boolean).map((word) => `✨${word}✨`).join(" ");
  if (mode === "uwu") {
    return input
      .replace(/[rl]/g, "w")
      .replace(/[RL]/g, "W")
      .replace(/ove/g, "uv")
      .replace(/OVE/g, "UV")
      .replace(/[.!?]+$/g, "")
      .concat(input.trim() ? " uwu" : "");
  }
  if (mode === "warning") return `⚠ ${input.trim().toUpperCase()} ⚠`;
  let index = 0;
  return Array.from(input)
    .map((character) => {
      if (!/[a-z]/i.test(character)) return character;
      index += 1;
      return index % 2 === 0 ? character.toUpperCase() : character.toLowerCase();
    })
    .join("");
}

export function MemeTextTransformerTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState("this is extremely serious");
  const [mode, setMode] = React.useState<(typeof memeModes)[number]["id"]>("mocking");
  const output = React.useMemo(() => transformMemeText(input, mode), [input, mode]);
  const warnings = [
    input.trim() ? "" : ui(dictionary, "playfulEmptyWarning", "Enter text before copying a generated result."),
    characterCount(output) > 120 ? ui(dictionary, "playfulLongWarning", "Long decorative text can wrap in bios, names, captions, and chat fields.") : "",
    ui(dictionary, "memeToneWarning", "Meme text can read as sarcasm. Use it where the tone is welcome."),
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <section className="rounded-md border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(12rem,16rem)]">
          <div>
            <label className="text-sm font-medium" htmlFor="meme-input">
              {ui(dictionary, "sourceText", "Source text")}
            </label>
            <Textarea id="meme-input" value={input} onChange={(event) => setInput(event.target.value.slice(0, 180))} className="mt-2 min-h-24" />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="meme-mode">
              {ui(dictionary, "mode", "Mode")}
            </label>
            <Select id="meme-mode" value={mode} onChange={(event) => setMode(event.target.value as typeof mode)} className="mt-2">
              {memeModes.map((item) => (
                <option key={item.id} value={item.id}>
                  {ui(dictionary, item.labelKey, item.fallback)}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </section>
      <CreativeMetricGrid
        items={[
          { label: ui(dictionary, "characters", "Characters"), value: String(characterCount(input)) },
          { label: ui(dictionary, "generatedCharacters", "Generated characters"), value: String(characterCount(output)) },
          { label: ui(dictionary, "words", "Words"), value: String(input.trim().split(/\s+/).filter(Boolean).length) },
          { label: ui(dictionary, "emojiCount", "Emoji count"), value: String((output.match(/\p{Emoji}/gu) ?? []).length) },
        ]}
      />
      <CreativeWarningList title={ui(dictionary, "playfulReviewNotes", "Copy-paste review notes")} warnings={warnings} emptyLabel={ui(dictionary, "playfulNoWarnings", "This output looks ready to copy. Still check it in the target app.")} />
      <CreativeResultBlock title={ui(dictionary, "generatedText", "Generated text")} value={output} dictionary={dictionary} />
    </div>
  );
}

const kaomojiMoods = [
  { id: "happy", labelKey: "kaomojiMoodHappy", fallback: "Happy", eyes: ["^", "≧", "•", "´"], mouths: ["ᴗ", "▽", "ᵕ", "‿"], arms: ["", "ヽ", "و", "つ"] },
  { id: "shy", labelKey: "kaomojiMoodShy", fallback: "Shy", eyes: ["˶", "///", "⁄", "u"], mouths: ["ᵕ", "ω", "꒳", "ㅅ"], arms: ["", "꒰", "っ", "♡"] },
  { id: "tableflip", labelKey: "kaomojiMoodChaos", fallback: "Chaos", eyes: ["ಠ", "╬", "ノ", "눈"], mouths: ["益", "Д", "□", "皿"], arms: ["╯", "ノ", "凸", "ง"] },
  { id: "sleepy", labelKey: "kaomojiMoodSleepy", fallback: "Sleepy", eyes: ["-", "＿", "ᴗ", "˘"], mouths: ["_", "ω", "﹏", "ᴗ"], arms: ["", "z", "Z", "ᶻ"] },
] as const;

function buildKaomoji(mood: (typeof kaomojiMoods)[number], eye: string, mouth: string, arm: string) {
  if (mood.id === "tableflip") return `${arm}( ${eye}${mouth}${eye})${arm}︵ ┻━┻`;
  if (arm === "つ") return `(つ${eye}${mouth}${eye})つ`;
  if (arm === "♡") return `♡(${eye}${mouth}${eye})♡`;
  if (arm === "z" || arm === "Z" || arm === "ᶻ") return `(${eye}${mouth}${eye}) ${arm}${arm}${arm}`;
  return `${arm ? `${arm} ` : ""}(${eye}${mouth}${eye})${arm ? ` ${arm}` : ""}`;
}

export function KaomojiMakerTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [moodId, setMoodId] = React.useState<(typeof kaomojiMoods)[number]["id"]>("happy");
  const mood = kaomojiMoods.find((item) => item.id === moodId) ?? kaomojiMoods[0];
  const [eye, setEye] = React.useState<string>(mood.eyes[0]);
  const [mouth, setMouth] = React.useState<string>(mood.mouths[0]);
  const [arm, setArm] = React.useState<string>(mood.arms[1]);
  React.useEffect(() => {
    setEye(mood.eyes[0]);
    setMouth(mood.mouths[0]);
    setArm(mood.arms[1]);
  }, [mood]);
  const output = buildKaomoji(mood, eye, mouth, arm);
  const variants = mood.eyes.slice(0, 3).flatMap((variantEye) => mood.mouths.slice(0, 2).map((variantMouth) => buildKaomoji(mood, variantEye, variantMouth, arm)));

  return (
    <div className="space-y-4">
      <section className="rounded-md border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <label className="text-sm font-medium" htmlFor="kaomoji-mood">
              {ui(dictionary, "vibe", "Vibe")}
            </label>
            <Select id="kaomoji-mood" value={moodId} onChange={(event) => setMoodId(event.target.value as typeof moodId)} className="mt-2">
              {kaomojiMoods.map((item) => (
                <option key={item.id} value={item.id}>
                  {ui(dictionary, item.labelKey, item.fallback)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="kaomoji-eye">
              {ui(dictionary, "kaomojiEyes", "Eyes")}
            </label>
            <Select id="kaomoji-eye" value={eye} onChange={(event) => setEye(event.target.value)} className="mt-2">
              {mood.eyes.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="kaomoji-mouth">
              {ui(dictionary, "kaomojiMouth", "Mouth")}
            </label>
            <Select id="kaomoji-mouth" value={mouth} onChange={(event) => setMouth(event.target.value)} className="mt-2">
              {mood.mouths.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="kaomoji-arm">
              {ui(dictionary, "kaomojiArms", "Arms")}
            </label>
            <Select id="kaomoji-arm" value={arm} onChange={(event) => setArm(event.target.value)} className="mt-2">
              {mood.arms.map((value) => (
                <option key={value || "none"} value={value}>
                  {value || ui(dictionary, "none", "None")}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </section>
      <CreativeMetricGrid
        items={[
          { label: ui(dictionary, "generatedVariants", "Generated variants"), value: String(variants.length) },
          { label: ui(dictionary, "characters", "Characters"), value: String(characterCount(output)) },
          { label: ui(dictionary, "vibe", "Vibe"), value: ui(dictionary, mood.labelKey, mood.fallback) },
          { label: ui(dictionary, "codePoints", "Code points"), value: Array.from(output).slice(0, 3).map(codePointLabel).join(", ") },
        ]}
      />
      <div className="grid gap-2 sm:grid-cols-2" data-tool-output-block>
        {variants.map((variant) => (
          <button key={variant} type="button" onClick={() => copyToClipboard(variant)} className="rounded-md border bg-card p-3 text-left font-mono text-sm transition-colors hover:bg-muted">
            {variant}
          </button>
        ))}
      </div>
      <CreativeWarningList title={ui(dictionary, "playfulReviewNotes", "Copy-paste review notes")} warnings={[ui(dictionary, "playfulPlatformWarning", "Preview decorative Unicode in the target app because fonts differ by platform.")]} emptyLabel={ui(dictionary, "playfulNoWarnings", "This output looks ready to copy. Still check it in the target app.")} />
      <CreativeResultBlock title={ui(dictionary, "generatedKaomoji", "Generated kaomoji")} value={output} dictionary={dictionary} />
    </div>
  );
}

const emojiVibes = [
  { id: "cute", labelKey: "emojiVibeCute", fallback: "Cute", items: ["૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა", "♡", "˚₊‧", "🧸", "🍓", "⋆"] },
  { id: "chaos", labelKey: "emojiVibeChaos", fallback: "Chaos", items: ["⚠", "💥", "🌀", "!!", "ಠ_ಠ", "🔥"] },
  { id: "study", labelKey: "emojiVibeStudy", fallback: "Study", items: ["✎", "📓", "☕", "⋆", "⌛", "✓"] },
  { id: "night", labelKey: "emojiVibeNight", fallback: "Night", items: ["☾", "✦", "🌙", "⋆", "🪐", "˚"] },
  { id: "retro", labelKey: "emojiVibeRetro", fallback: "Retro", items: ["▣", "◈", "✧", "☎", "♪", "◆"] },
] as const;

function buildEmojiCombos(vibe: (typeof emojiVibes)[number], seed: string, density: number) {
  const words = seed.trim().split(/\s+/).filter(Boolean);
  return Array.from({ length: 5 }, (_, index) => {
    const left = vibe.items[(index + density) % vibe.items.length];
    const middle = words[index % Math.max(words.length, 1)] ?? vibe.fallback.toLowerCase();
    const right = vibe.items[(index + density + 2) % vibe.items.length];
    const tail = density > 2 ? ` ${vibe.items[(index + 4) % vibe.items.length]}` : "";
    return `${left} ${middle} ${right}${tail}`;
  }).join("\n");
}

export function EmojiComboBuilderTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [seed, setSeed] = React.useState("new post");
  const [vibeId, setVibeId] = React.useState<(typeof emojiVibes)[number]["id"]>("cute");
  const [density, setDensity] = React.useState(2);
  const vibe = emojiVibes.find((item) => item.id === vibeId) ?? emojiVibes[0];
  const output = React.useMemo(() => buildEmojiCombos(vibe, seed, density), [density, seed, vibe]);
  const emojiCount = output.match(/\p{Emoji}/gu)?.length ?? 0;
  const warnings = [
    seed.trim() ? "" : ui(dictionary, "playfulEmptyWarning", "Enter text before copying a generated result."),
    density > 3 ? ui(dictionary, "emojiDenseWarning", "Dense emoji combos can look noisy in titles and bios.") : "",
    ui(dictionary, "playfulPlatformWarning", "Preview decorative Unicode in the target app because fonts differ by platform."),
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <section className="rounded-md border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(10rem,14rem)_minmax(8rem,10rem)]">
          <div>
            <label className="text-sm font-medium" htmlFor="emoji-seed">
              {ui(dictionary, "seedText", "Seed text")}
            </label>
            <Input id="emoji-seed" value={seed} onChange={(event) => setSeed(event.target.value.slice(0, 60))} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="emoji-vibe">
              {ui(dictionary, "vibe", "Vibe")}
            </label>
            <Select id="emoji-vibe" value={vibeId} onChange={(event) => setVibeId(event.target.value as typeof vibeId)} className="mt-2">
              {emojiVibes.map((item) => (
                <option key={item.id} value={item.id}>
                  {ui(dictionary, item.labelKey, item.fallback)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="emoji-density">
              {ui(dictionary, "density", "Density")}
            </label>
            <Input id="emoji-density" type="number" min={1} max={4} value={density} onChange={(event) => setDensity(Math.max(1, Math.min(4, Number(event.target.value))))} className="mt-2" />
          </div>
        </div>
      </section>
      <CreativeMetricGrid
        items={[
          { label: ui(dictionary, "generatedVariants", "Generated variants"), value: String(output.split("\n").length) },
          { label: ui(dictionary, "emojiCount", "Emoji count"), value: String(emojiCount) },
          { label: ui(dictionary, "characters", "Characters"), value: String(characterCount(output)) },
          { label: ui(dictionary, "vibe", "Vibe"), value: ui(dictionary, vibe.labelKey, vibe.fallback) },
        ]}
      />
      <CreativeWarningList title={ui(dictionary, "playfulReviewNotes", "Copy-paste review notes")} warnings={warnings} emptyLabel={ui(dictionary, "playfulNoWarnings", "This output looks ready to copy. Still check it in the target app.")} />
      <CreativeResultBlock title={ui(dictionary, "generatedEmojiCombos", "Generated emoji combos")} value={output} dictionary={dictionary} />
    </div>
  );
}

const bioTemplates = [
  { id: "soft", labelKey: "bioTemplateSoft", fallback: "Soft" },
  { id: "badge", labelKey: "bioTemplateBadge", fallback: "Badge" },
  { id: "minimal", labelKey: "bioTemplateMinimal", fallback: "Minimal" },
] as const;

function buildBio(name: string, tagline: string, vibe: (typeof emojiVibes)[number], template: (typeof bioTemplates)[number]["id"]) {
  const safeName = name.trim() || "Bobob";
  const safeTagline = tagline.trim() || "tiny tools, big energy";
  if (template === "badge") return `┌─ ${safeName} ─┐\n${vibe.items[0]} ${safeTagline}\n${vibe.items[2]} copy-paste ready\n└────────────┘`;
  if (template === "minimal") return `${safeName}\n${safeTagline}\n${vibe.items.slice(0, 4).join(" ")}`;
  return `˚₊‧ ${safeName} ‧₊˚\n${vibe.items[0]} ${safeTagline} ${vibe.items[1]}\n${vibe.items[2]} ${vibe.items[3]} ${vibe.items[4]}`;
}

export function AestheticBioBuilderTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [name, setName] = React.useState("Bobob");
  const [tagline, setTagline] = React.useState("local tools with cute chaos");
  const [vibeId, setVibeId] = React.useState<(typeof emojiVibes)[number]["id"]>("night");
  const [templateId, setTemplateId] = React.useState<(typeof bioTemplates)[number]["id"]>("soft");
  const vibe = emojiVibes.find((item) => item.id === vibeId) ?? emojiVibes[0];
  const output = React.useMemo(() => buildBio(name, tagline, vibe, templateId), [name, tagline, templateId, vibe]);
  const warnings = [
    characterCount(output) > 150 ? ui(dictionary, "bioLengthWarning", "This bio may be too long for some profile fields.") : "",
    ui(dictionary, "playfulPlatformWarning", "Preview decorative Unicode in the target app because fonts differ by platform."),
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <section className="rounded-md border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium" htmlFor="bio-name">
              {ui(dictionary, "profileName", "Profile name")}
            </label>
            <Input id="bio-name" value={name} onChange={(event) => setName(event.target.value.slice(0, 40))} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="bio-tagline">
              {ui(dictionary, "tagline", "Tagline")}
            </label>
            <Input id="bio-tagline" value={tagline} onChange={(event) => setTagline(event.target.value.slice(0, 80))} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="bio-vibe">
              {ui(dictionary, "vibe", "Vibe")}
            </label>
            <Select id="bio-vibe" value={vibeId} onChange={(event) => setVibeId(event.target.value as typeof vibeId)} className="mt-2">
              {emojiVibes.map((item) => (
                <option key={item.id} value={item.id}>
                  {ui(dictionary, item.labelKey, item.fallback)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="bio-template">
              {ui(dictionary, "template", "Template")}
            </label>
            <Select id="bio-template" value={templateId} onChange={(event) => setTemplateId(event.target.value as typeof templateId)} className="mt-2">
              {bioTemplates.map((item) => (
                <option key={item.id} value={item.id}>
                  {ui(dictionary, item.labelKey, item.fallback)}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </section>
      <CreativeMetricGrid
        items={[
          { label: ui(dictionary, "characters", "Characters"), value: String(characterCount(output)) },
          { label: ui(dictionary, "lines", "Lines"), value: String(output.split("\n").length) },
          { label: ui(dictionary, "emojiCount", "Emoji count"), value: String((output.match(/\p{Emoji}/gu) ?? []).length) },
          { label: ui(dictionary, "template", "Template"), value: ui(dictionary, bioTemplates.find((item) => item.id === templateId)?.labelKey ?? "template", templateId) },
        ]}
      />
      <CreativeWarningList title={ui(dictionary, "playfulReviewNotes", "Copy-paste review notes")} warnings={warnings} emptyLabel={ui(dictionary, "playfulNoWarnings", "This output looks ready to copy. Still check it in the target app.")} />
      <CreativeResultBlock title={ui(dictionary, "generatedBio", "Generated bio")} value={output} dictionary={dictionary} />
    </div>
  );
}
