import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import type { NextRequest } from "next/server";

type RateBucket = {
  count: number;
  resetAt: number;
};

const rateBuckets = new Map<string, RateBucket>();

function requestIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "anonymous";
}

export function consumeRateLimit(request: NextRequest, scope: string, limit = 30, windowMs = 60_000) {
  const now = Date.now();
  const key = `${scope}:${requestIp(request)}`;
  const current = rateBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  current.count += 1;
  if (current.count <= limit) return null;

  return {
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

function ipv4Number(ip: string) {
  return ip.split(".").reduce((value, part) => (value << 8) + Number(part), 0) >>> 0;
}

function inIpv4Range(ip: string, start: string, end: string) {
  const value = ipv4Number(ip);
  return value >= ipv4Number(start) && value <= ipv4Number(end);
}

function isPrivateOrReservedIpv4(ip: string) {
  return [
    ["0.0.0.0", "0.255.255.255"],
    ["10.0.0.0", "10.255.255.255"],
    ["100.64.0.0", "100.127.255.255"],
    ["127.0.0.0", "127.255.255.255"],
    ["169.254.0.0", "169.254.255.255"],
    ["172.16.0.0", "172.31.255.255"],
    ["192.0.0.0", "192.0.0.255"],
    ["192.0.2.0", "192.0.2.255"],
    ["192.168.0.0", "192.168.255.255"],
    ["198.18.0.0", "198.19.255.255"],
    ["198.51.100.0", "198.51.100.255"],
    ["203.0.113.0", "203.0.113.255"],
    ["224.0.0.0", "255.255.255.255"],
  ].some(([start, end]) => inIpv4Range(ip, start, end));
}

function isPrivateOrReservedIpv6(ip: string) {
  const value = ip.toLowerCase();
  if (value === "::" || value === "::1") return true;
  if (value.startsWith("::ffff:")) {
    const mapped = value.slice("::ffff:".length);
    if (isIP(mapped) === 4) return isPrivateOrReservedIpv4(mapped);
  }
  return (
    value.startsWith("fc") ||
    value.startsWith("fd") ||
    value.startsWith("fe8") ||
    value.startsWith("fe9") ||
    value.startsWith("fea") ||
    value.startsWith("feb") ||
    value.startsWith("ff") ||
    value.startsWith("2001:db8")
  );
}

export function isPrivateOrReservedIp(ip: string) {
  const kind = isIP(ip);
  if (kind === 4) return isPrivateOrReservedIpv4(ip);
  if (kind === 6) return isPrivateOrReservedIpv6(ip);
  return true;
}

export function normalizePublicHostname(value: string) {
  const hostname = value.trim().toLowerCase();
  if (!hostname || hostname.length > 253) throw new Error("Use a public hostname.");
  if (hostname === "localhost" || hostname.endsWith(".local")) throw new Error("Use a public hostname.");

  const ipKind = isIP(hostname);
  if (ipKind) {
    if (isPrivateOrReservedIp(hostname)) throw new Error("Private or reserved IP addresses are not supported.");
    return hostname;
  }

  if (!/^[a-z0-9.-]+$/.test(hostname) || !hostname.includes(".")) {
    throw new Error("Use a public hostname.");
  }

  return hostname;
}

export async function assertPublicResolvedHostname(value: string) {
  const hostname = normalizePublicHostname(value);
  if (isIP(hostname)) return hostname;

  const addresses = await lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length) throw new Error("Hostname did not resolve to a public address.");

  const blocked = addresses.find((address) => isPrivateOrReservedIp(address.address));
  if (blocked) throw new Error("Hostname resolves to a private or reserved address.");

  return hostname;
}

export async function assertPublicHttpUrl(value: string | URL) {
  const url = value instanceof URL ? value : new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Use a public http or https URL.");
  if (url.username || url.password) throw new Error("URLs with credentials are not supported.");
  await assertPublicResolvedHostname(url.hostname);
  return url;
}
