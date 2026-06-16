const defaultHost = "www.bobob.app";
const defaultKey = "ac3d32921a2fa361bd499222bff28abf";
const endpoint = process.env.BOBOB_INDEXNOW_ENDPOINT ?? "https://www.bing.com/indexnow";
const host = process.env.BOBOB_INDEXNOW_HOST ?? defaultHost;
const key = process.env.BOBOB_INDEXNOW_KEY ?? defaultKey;
const baseUrl = `https://${host}`;
const keyLocation = process.env.BOBOB_INDEXNOW_KEY_LOCATION ?? `${baseUrl}/${key}.txt`;
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;

function assertOkResponse(response, url) {
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "BobobIndexNowSubmitter/1.0",
    },
  });
  assertOkResponse(response, url);
  return response.text();
}

function xmlLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

async function collectSitemapUrls() {
  const indexXml = await fetchText(`${baseUrl}/sitemap.xml`);
  const sitemapUrls = xmlLocs(indexXml).filter((url) => new URL(url).host === host);
  const urlSet = new Set();

  for (const sitemapUrl of sitemapUrls) {
    const sitemapXml = await fetchText(sitemapUrl);
    for (const url of xmlLocs(sitemapXml)) {
      if (new URL(url).host === host) urlSet.add(url);
    }
  }

  const urls = [...urlSet].sort((left, right) => {
    const leftPath = new URL(left).pathname;
    const rightPath = new URL(right).pathname;
    return leftPath.localeCompare(rightPath);
  });

  return Number.isFinite(limit) ? urls.slice(0, limit) : urls;
}

async function submitIndexNow(urlList) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "user-agent": "BobobIndexNowSubmitter/1.0",
    },
    body: JSON.stringify({
      host,
      key,
      keyLocation,
      urlList,
    }),
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`IndexNow submission failed with ${response.status}: ${body}`);
  }
  return { status: response.status, body };
}

const urlList = await collectSitemapUrls();
const payload = {
  endpoint,
  host,
  keyLocation,
  urlCount: urlList.length,
  sampleUrls: urlList.slice(0, 10),
};

if (dryRun) {
  console.log(JSON.stringify({ dryRun: true, ...payload }, null, 2));
} else {
  const result = await submitIndexNow(urlList);
  console.log(JSON.stringify({ dryRun: false, ...payload, result }, null, 2));
}
