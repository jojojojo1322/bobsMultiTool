import fs from "node:fs";
import path from "node:path";

export function resolveContentDir(kind: "blog" | "play") {
  const candidates = [
    path.join(process.cwd(), "content", kind),
    path.join(process.cwd(), "..", "..", "content", kind),
    path.join(process.cwd(), "..", "content", kind),
  ];
  const match = candidates.find((candidate) => fs.existsSync(candidate));

  if (!match) {
    throw new Error(`Unable to locate content/${kind} from ${process.cwd()}`);
  }

  return match;
}
