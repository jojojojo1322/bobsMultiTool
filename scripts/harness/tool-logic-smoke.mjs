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

check(CryptoJS.SHA256("hello world").toString() === "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9", "sha256 output mismatch");
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
