import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import assert from "node:assert/strict";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const assetDir = resolve(dist, "assets");

assert.ok(existsSync(dist), "dist should exist before build asset verification");
assert.ok(existsSync(assetDir), "dist/assets should exist before build asset verification");

const files = [];
const directories = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      directories.push(fullPath);
      walk(fullPath);
      continue;
    }
    files.push(fullPath);
  }
}

walk(dist);

const dotAssetFiles = files
  .map((file) => relative(dist, file).replace(/\\/g, "/"))
  .filter((file) => file.split("/").some((part) => part.startsWith(".")));

assert.deepEqual(dotAssetFiles, [], "build assets must not contain dot-prefixed files");

const leakedLocalPathParts = [...files, ...directories]
  .map((file) => relative(dist, file).replace(/\\/g, "/"))
  .filter((file) => /(^|\/)[A-Za-z]:($|\/)/.test(file) || file.includes("Codex xiangmu"));

assert.deepEqual(leakedLocalPathParts, [], "build assets must not contain local filesystem paths");

const jsFiles = files.filter((file) => extname(file) === ".js");
for (const file of jsFiles) {
  const content = readFileSync(file, "utf8");
  assert.doesNotMatch(
    content,
    /(?:from\s*["']\.\/\.|import\(["']\.\/\.)/,
    `${relative(dist, file)} must not reference dot-prefixed chunks`,
  );
}

console.log("build asset verification passed");
