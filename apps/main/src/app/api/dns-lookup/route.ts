import { resolve4, resolve6, resolveCname, resolveMx, resolveNs, resolveTxt } from "node:dns/promises";
import { NextRequest, NextResponse } from "next/server";

const resolvers = {
  A: resolve4,
  AAAA: resolve6,
  CNAME: resolveCname,
  MX: resolveMx,
  TXT: resolveTxt,
  NS: resolveNs,
};

function isPublicHostname(value: string) {
  const hostname = value.trim().toLowerCase();
  if (!hostname || hostname.length > 253) return false;
  if (hostname === "localhost" || hostname.endsWith(".local")) return false;
  if (/^(10|127|169\.254|172\.(1[6-9]|2\d|3[0-1])|192\.168)\./.test(hostname)) return false;
  return /^[a-z0-9.-]+$/.test(hostname) && hostname.includes(".");
}

export async function GET(request: NextRequest) {
  const hostname = request.nextUrl.searchParams.get("hostname") ?? "";
  const record = (request.nextUrl.searchParams.get("record") ?? "A").toUpperCase() as keyof typeof resolvers;

  if (!isPublicHostname(hostname)) {
    return NextResponse.json({ error: "Use a public hostname." }, { status: 400 });
  }

  const resolver = resolvers[record];
  if (!resolver) {
    return NextResponse.json({ error: "Unsupported record type." }, { status: 400 });
  }

  try {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("DNS lookup timed out.")), 5_000);
    });
    const records = await Promise.race([resolver(hostname), timeout]);
    return NextResponse.json({ hostname, record, records });
  } catch (error) {
    return NextResponse.json({ hostname, record, error: error instanceof Error ? error.message : "DNS lookup failed." }, { status: 502 });
  }
}
