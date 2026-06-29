import fs from "node:fs";
import path from "node:path";
import { validatePlayPlanningBriefs } from "./play-planning-rules.mjs";

const root = process.cwd();
const playDir = path.join(root, "content/play");

const playEntries = fs
  .readdirSync(playDir)
  .filter((file) => file.endsWith(".json"))
  .sort()
  .map((file) => ({
    file,
    ...JSON.parse(fs.readFileSync(path.join(playDir, file), "utf8")),
  }));

const failures = validatePlayPlanningBriefs(playEntries);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Play planning smoke passed for ${playEntries.length} Play entries.`);
