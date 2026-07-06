import { ImageResponse } from "next/og";

export const runtime = "edge";

const size = {
  width: 1200,
  height: 630,
};

const kindLabels: Record<string, string> = {
  home: "WEB OPS",
  blog: "BLOG NOTE",
  play: "SMALL PLAY",
  category: "BLOG CATEGORY",
};

function clampTitle(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  const asciiTitle = normalized.replace(/[^\x20-\x7E]/g, "").replace(/\s+/g, " ").trim();
  if (!asciiTitle) return "Read. Click. Fix.";
  return asciiTitle.length > 72 ? `${asciiTitle.slice(0, 69)}...` : asciiTitle;
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") ?? "home";
  const title = clampTitle(url.searchParams.get("title") ?? "Read. Click. Fix.");
  const kindLabel = kindLabels[kind] ?? kindLabels.home;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f5ef",
          color: "#18181b",
          padding: "64px",
          border: "1px solid #ded8ca",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 30, letterSpacing: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 18, height: 18, borderRadius: 999, background: "#18181b" }} />
            <span style={{ fontWeight: 700 }}>bobob.app</span>
          </div>
          <span style={{ color: "#71717a", fontWeight: 700 }}>{kindLabel}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, fontWeight: 800, letterSpacing: 0, maxWidth: 980 }}>{title}</div>
          <div style={{ display: "flex", gap: 14, fontSize: 28, color: "#3f3f46" }}>
            <span style={{ padding: "10px 18px", border: "1px solid #d4cfc3", borderRadius: 12 }}>read</span>
            <span style={{ padding: "10px 18px", border: "1px solid #d4cfc3", borderRadius: 12 }}>click</span>
            <span style={{ padding: "10px 18px", border: "1px solid #d4cfc3", borderRadius: 12 }}>fix</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "#52525b" }}>
          <span>development notes and small web play</span>
          <span>www.bobob.app</span>
        </div>
      </div>
    ),
    size,
  );
}
