const defaultBaseUrl = "https://www.bobob.app";
const hubUrl = process.env.BOBOB_WEBSUB_HUB ?? "https://pubsubhubbub.appspot.com/";
const baseUrl = (process.env.BOBOB_WEBSUB_BASE_URL ?? defaultBaseUrl).replace(/\/$/, "");
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const topics = (process.env.BOBOB_WEBSUB_TOPICS ?? `${baseUrl}/feed.xml,${baseUrl}/atom.xml`)
  .split(",")
  .map((topic) => topic.trim())
  .filter(Boolean);

async function verifyTopic(topic) {
  const response = await fetch(topic, {
    headers: {
      "user-agent": "BobobWebSubSubmitter/1.0",
      accept: "application/rss+xml,application/atom+xml,application/xml,text/xml,*/*",
    },
  });
  if (!response.ok) throw new Error(`${topic} returned ${response.status}`);
  const body = await response.text();
  if (!body.includes(hubUrl)) throw new Error(`${topic} does not advertise WebSub hub ${hubUrl}`);
  return {
    topic,
    contentType: response.headers.get("content-type") ?? "",
    itemCount: (body.match(/<item>/g) ?? []).length,
    entryCount: (body.match(/<entry>/g) ?? []).length,
  };
}

async function publishTopic(topic) {
  const body = new URLSearchParams({
    "hub.mode": "publish",
    "hub.url": topic,
  });
  const response = await fetch(hubUrl, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": "BobobWebSubSubmitter/1.0",
    },
    body,
  });
  const text = await response.text();
  if (response.status !== 204 && !response.ok) {
    throw new Error(`WebSub publish failed for ${topic} with ${response.status}: ${text}`);
  }
  return {
    topic,
    status: response.status,
    body: text,
  };
}

const verifiedTopics = [];
for (const topic of topics) {
  verifiedTopics.push(await verifyTopic(topic));
}

if (dryRun) {
  console.log(JSON.stringify({ dryRun: true, hubUrl, baseUrl, topics: verifiedTopics }, null, 2));
} else {
  const published = [];
  for (const topic of topics) {
    published.push(await publishTopic(topic));
  }
  console.log(JSON.stringify({ dryRun: false, hubUrl, baseUrl, topics: verifiedTopics, published }, null, 2));
}
