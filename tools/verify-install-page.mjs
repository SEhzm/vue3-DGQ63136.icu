import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const root = resolve(import.meta.dirname, "..");
const constants = readFileSync(resolve(root, "src/constants/backend.ts"), "utf8");
const page = readFileSync(resolve(root, "src/views/MainLayout/components/Tampermonkey.vue"), "utf8");

const scriptUrl =
  "https://web-static-res-edge-speedtest-b1-hk.dahi.edu.eu.org/scripts/511991/dgq63136cn%E6%96%97%E9%B1%BC%E5%86%AC%E7%93%9C%E5%BC%BA%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86.user.js";

assert.ok(constants.includes("path: '/Tampermonkey'"), "left menu should include Tampermonkey route");
assert.ok(constants.includes("text: '一键安装插件'"), "left menu label should be 一键安装插件");

assert.ok(page.includes("currentPluginVersion"), "page should expose current plugin version");
assert.ok(page.includes("v2026.08.11.01"), "page should show latest plugin version");
assert.ok(page.includes(scriptUrl), "page should link to current userscript install URL");
assert.ok(page.includes("一键安装弹幕插件"), "page should have a primary install button");
assert.ok(page.includes("安装油猴管理器"), "page should have Tampermonkey install entry");
assert.ok(page.includes("updateHistory"), "page should render plugin update history");
assert.ok(page.includes("更新历史"), "page should title the update history section");
assert.ok(page.includes("version") && page.includes("date") && page.includes("changes"), "history items should include date, version and changes fields");
assert.ok(page.includes("弹幕一键投稿") && page.includes("本地收藏"), "history should include latest feature changes");

console.log("install page verification passed");
