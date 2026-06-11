import { resolve4, resolve6, resolveCname, resolveMx, resolveNs, resolveTxt } from "node:dns/promises";
import { isIP } from "node:net";
import { NextRequest, NextResponse } from "next/server";
import { consumeRateLimit, isPrivateOrReservedIp } from "@/features/server/network-guards";

const resolvers = {
  A: resolve4,
  AAAA: resolve6,
  CNAME: resolveCname,
  MX: resolveMx,
  TXT: resolveTxt,
  NS: resolveNs,
};

function normalizePublicDnsName(value: string) {
  const hostname = value.trim().toLowerCase().replace(/\.$/, "");
  if (!hostname || hostname.length > 253) throw new Error("Use a public hostname.");
  if (hostname === "localhost" || hostname.endsWith(".local")) throw new Error("Use a public hostname.");

  const ipKind = isIP(hostname);
  if (ipKind) {
    if (isPrivateOrReservedIp(hostname)) throw new Error("Private or reserved IP addresses are not supported.");
    return hostname;
  }

  if (!hostname.includes(".")) throw new Error("Use a public hostname.");

  const labels = hostname.split(".");
  const invalidLabel = labels.some((label, index) => {
    if (!label || label.length > 63) return true;
    if (!/^[a-z0-9_-]+$/.test(label)) return true;
    if (label.startsWith("-") || label.endsWith("-")) return true;
    return index === labels.length - 1 && label.includes("_");
  });
  if (invalidLabel) throw new Error("Use a public hostname.");

  return hostname;
}

export async function GET(request: NextRequest) {
  const rateLimit = consumeRateLimit(request, "dns-lookup", 50);
  if (rateLimit) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const hostname = request.nextUrl.searchParams.get("hostname") ?? "";
  const record = (request.nextUrl.searchParams.get("record") ?? "A").toUpperCase() as keyof typeof resolvers;
  let normalizedHostname: string;

  try {
    normalizedHostname = normalizePublicDnsName(hostname);
  } catch {
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
    const records = await Promise.race([resolver(normalizedHostname), timeout]);
    if ((record === "A" || record === "AAAA") && Array.isArray(records) && records.some((ip) => typeof ip === "string" && isPrivateOrReservedIp(ip))) {
      return NextResponse.json({ hostname: normalizedHostname, record, error: "Hostname resolves to a private or reserved address." }, { status: 400 });
    }
    return NextResponse.json({ hostname: normalizedHostname, record, records });
  } catch (error) {
    return NextResponse.json({ hostname: normalizedHostname, record, error: error instanceof Error ? error.message : "DNS lookup failed." }, { status: 502 });
  }
}
