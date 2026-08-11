import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const root = resolve(import.meta.dirname, "..");
const constants = readFileSync(resolve(root, "src/constants/backend.ts"), "utf8");
const page = readFileSync(resolve(root, "src/views/MainLayout/components/Tampermonkey.vue"), "utf8");
const home = readFileSync(resolve(root, "src/views/MainLayout/components/Home.vue"), "utf8");

const scriptUrl =
  "https://cdn.hguofichp.cn/dgq63136.user.js";
const greasyForkUrl =
  "https://greasyfork.org/zh-CN/scripts/511991-dgq63136-cn%E6%96%97%E9%B1%BC%E5%86%AC%E7%93%9C%E5%BC%BA%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86";
const staleInstallHosts = ["web-static-res-edge-speedtest-b1-hk.dahi.edu.eu.org"];
const staleInstallFiles = ["2026.08.11.02.user.js"];

assert.ok(constants.includes("path: '/Tampermonkey'"), "left menu should include Tampermonkey route");
assert.ok(constants.includes("text: '一键安装插件'"), "left menu label should be 一键安装插件");

assert.ok(page.includes("currentPluginVersion"), "page should expose current plugin version");
const displayedVersions = [
  ...page.matchAll(/\b(?:currentPluginVersion\s*=\s*|version:\s*)'([^']+)'/g),
].map((match) => match[1]);
assert.deepEqual(
  displayedVersions,
  ["V0.1.2", "V0.1.2", "V0.1.1", "V0.1.0", "V0.0.9", "V0.0.8", "V0.0.7", "V0.0.6", "V0.0.5", "V0.0.4", "V0.0.3", "V0.0.2", "V0.0.1"],
  "plugin versions should advance from V0.0.9 to V0.1.0 and continue to V0.1.2",
);
assert.ok(!displayedVersions.includes("V0.0.10"), "V0.0.9 should advance to V0.1.0, not V0.0.10");
for (const version of displayedVersions) {
  assert.match(version, /^V\d+\.\d+\.\d+$/, "plugin version should be uppercase V plus three numeric parts");
}
assert.doesNotMatch(
  page,
  /\b(?:currentPluginVersion\s*=\s*|version:\s*)'v(?:\d{2,4}\.)/i,
  "displayed plugin versions should not use date-style version strings",
);
assert.ok(page.includes(scriptUrl), "page should link to current userscript install URL");
assert.ok(page.includes(greasyForkUrl), "page should keep Greasy Fork as backup install page");
assert.ok(page.includes("一键安装插件"), "page should have a primary install button");
assert.ok(page.includes("安装油猴管理器"), "page should have Tampermonkey install entry");
assert.ok(page.includes("updateHistory"), "page should render plugin update history");
assert.ok(page.includes("更新历史"), "page should title the update history section");
assert.ok(page.includes("版本号：") && page.includes("更新时间："), "history should label version and update time");
assert.ok(page.includes("version") && page.includes("updatedAt") && page.includes("changes"), "history items should include update time, version and changes fields");
assert.match(page, /2026-08-12 03:45/, "latest update time should show year-month-day hour:minute");
assert.match(page, /updatedAt: '\d{4}-\d{2}-\d{2} \d{2}:\d{2}'/, "history update time should use YYYY-MM-DD HH:mm");
assert.ok(page.includes("弹幕一键投稿") && page.includes("本地收藏"), "history should include latest feature changes");
assert.ok(page.includes("右侧元素被裁切"), "latest history should mention the floating panel clipping fix");
assert.ok(page.includes("顶部“更新”按钮改为先检测当前插件版本"), "latest history should mention update detection dialog");
assert.ok(page.includes("只给普通聊天弹幕显示投 / +1"), "latest history should mention ordinary barrage quick action fix");
assert.ok(page.includes("@呆物麋羊"), "user-authored update history should include @呆物麋羊 signature");
assert.ok(!page.includes("@呆物麋羊 更新"), "signature should not include update wording");
assert.ok(home.includes(scriptUrl), "home install links should use current userscript install URL");
for (const staleHost of staleInstallHosts) {
  assert.ok(!page.includes(staleHost), `page should not include stale install host: ${staleHost}`);
  assert.ok(!home.includes(staleHost), `home should not include stale install host: ${staleHost}`);
}
for (const staleFile of staleInstallFiles) {
  assert.ok(!page.includes(staleFile), `page should not include stale install file: ${staleFile}`);
  assert.ok(!home.includes(staleFile), `home should not include stale install file: ${staleFile}`);
}

console.log("install page verification passed");
