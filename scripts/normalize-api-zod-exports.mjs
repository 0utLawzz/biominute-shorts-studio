import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "..");
const file = path.join(workspaceRoot, "lib/api-zod/src/index.ts");
const source = fs.readFileSync(file, "utf8");
let cleaned = source
  .split("\n")
  .filter((line) => !/^\s*export \* from ['"]\.\/generated\/types['"];?\s*$/.test(line))
  .join("\n")
  .replace(/\n{3,}$/u, "\n");

if (!cleaned.includes('export * from "./generated/api";')) {
  cleaned = `export * from "./generated/api";\n${cleaned}`;
}

fs.writeFileSync(file, cleaned);
console.log("Normalized api-zod export barrel.");