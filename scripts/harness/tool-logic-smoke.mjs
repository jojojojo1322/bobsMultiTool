import CryptoJS from "crypto-js";
import { diffLines } from "diff";
import Papa from "papaparse";
import QRCode from "qrcode";
import { format as formatSql } from "sql-formatter";
import { parse as parseYaml } from "yaml";

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const escapeJsonString = (value) => JSON.stringify(value).slice(1, -1);
const quoteJsonEscapedInput = (value) => {
  let output = "";
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    const previous = value[index - 1];
    if (character === "\"" && previous !== "\\") output += "\\\"";
    else if (character === "\n") output += "\\n";
    else if (character === "\r") output += "\\r";
    else if (character === "\t") output += "\\t";
    else output += character;
  }
  return `"${output}"`;
};
const unescapeJsonString = (value) => {
  const trimmed = value.trim();
  const candidate = trimmed.startsWith("\"") && trimmed.endsWith("\"") ? trimmed : quoteJsonEscapedInput(value);
  const parsed = JSON.parse(candidate);
  if (typeof parsed !== "string") throw new Error("Input must be a JSON string value.");
  return parsed;
};

check(CryptoJS.SHA256("hello world").toString() === "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9", "sha256 output mismatch");
check(escapeJsonString("hello \"Bob\"\n") === "hello \\\"Bob\\\"\\n", "json escape output mismatch");
check(unescapeJsonString("hello \\\"Bob\\\"\\n") === "hello \"Bob\"\n", "json unescape output mismatch");
check(diffLines("a\nb\n", "a\nc\n").some((part) => part.added), "diff did not detect addition");
check(parseYaml("name: Bob").name === "Bob", "yaml parse failed");
check(formatSql("select * from users").toLowerCase().includes("select"), "sql formatter failed");
check(Papa.parse("id,name\n1,Bob", { header: true }).data[0].name === "Bob", "csv parser failed");
const qr = await QRCode.toDataURL("https://www.bobob.app");
check(qr.startsWith("data:image/png;base64,"), "qr generation failed");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Tool logic smoke passed.");
