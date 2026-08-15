import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const root = resolve(import.meta.dirname, "..");
const constants = readFileSync(resolve(root, "src/constants/backend.ts"), "utf8");
const page = readFileSync(resolve(root, "src/views/MainLayout/components/Tampermonkey.vue"), "utf8");
const home = readFileSync(resolve(root, "src/views/MainLayout/components/Home.vue"), "utf8");
const publicUserscript = readFileSync(resolve(root, "public/dgq63136.user.js"), "utf8");

const installLink = "/dgq63136.user.js";
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
  ["V0.2.13", "V0.2.13", "V0.2.12", "V0.2.11", "V0.2.10", "V0.2.9", "V0.2.8", "V0.2.7", "V0.2.6", "V0.2.5", "V0.2.4", "V0.2.3", "V0.2.1", "V0.2.0", "V0.1.9", "V0.1.8", "V0.1.7", "V0.1.6", "V0.1.5", "V0.1.4", "V0.1.3", "V0.1.2", "V0.1.1", "V0.1.0", "V0.0.9", "V0.0.8", "V0.0.7", "V0.0.6", "V0.0.5", "V0.0.4", "V0.0.3", "V0.0.2", "V0.0.1"],
  "plugin versions should advance from V0.0.9 to V0.1.0 and continue to V0.2.13",
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
assert.ok(page.includes(installLink), "page should link to packaged userscript install path");
assert.ok(page.includes(greasyForkUrl), "page should keep Greasy Fork as backup install page");
assert.ok(page.includes("一键安装插件"), "page should have a primary install button");
assert.ok(page.includes("安装油猴管理器"), "page should have Tampermonkey install entry");
assert.ok(page.includes("允许用户脚本"), "page should remind users to enable Tampermonkey user scripts");
assert.ok(page.includes("permissionSteps"), "page should include a detailed user-script permission tutorial");
assert.ok(page.includes("requiredSwitches"), "page should show the two required browser switches separately");
assert.ok(page.includes("chrome://extensions") && page.includes("edge://extensions"), "permission tutorial should include Chrome and Edge extension manager URLs");
assert.ok(page.includes("Allow user scripts"), "permission tutorial should include the English switch wording");
assert.ok(page.includes("在 InPrivate 中允许"), "permission tutorial should tell users to enable InPrivate access too");
assert.ok(page.includes("两个开关都打开"), "permission tutorial should clearly say both switches are required");
assert.ok(page.includes("详细信息") && page.includes("详情"), "permission tutorial should tell users to open extension details");
assert.ok(page.includes("两个开关都打开"), "permission tutorial should include the exact step to enable both switches");
assert.ok(page.includes("index: '5'"), "permission tutorial should include a five-step flow");
assert.ok(page.includes("安装后这样确认"), "permission tutorial should include post-install checks");
assert.ok(page.includes("聊天输入框旁能看到“厕纸”按钮"), "permission tutorial should tell users how to verify plugin startup");
assert.ok(page.includes("updateHistory"), "page should render plugin update history");
assert.ok(page.includes("更新历史"), "page should title the update history section");
assert.ok(page.includes("版本号：") && page.includes("更新时间："), "history should label version and update time");
assert.ok(page.includes("version") && page.includes("updatedAt") && page.includes("changes"), "history items should include update time, version and changes fields");
assert.match(page, /2026-08-15 16:20/, "latest update time should show year-month-day hour:minute");
assert.match(page, /updatedAt: '\d{4}-\d{2}-\d{2} \d{2}:\d{2}'/, "history update time should use YYYY-MM-DD HH:mm");
const updateHistoryMatch = page.match(/const updateHistory = \[[\s\S]*?\n\];/);
assert.ok(updateHistoryMatch, "page should keep a visible update history");
const publicHistory = updateHistoryMatch[0];
assert.ok(publicHistory.includes("优化公开更新说明"), "latest history should explain the simplified public wording");
for (const forbidden of ["UID", "自动禁言", "Greasy Fork 技术", "@version", "DouyuEx", "接口码", "上报", "捕获阶段", "DOM"]) {
  assert.ok(!publicHistory.includes(forbidden), `public history should not expose detailed implementation wording: ${forbidden}`);
}
assert.ok(!publicHistory.includes("ycfg.mygamemod.com"), "install page history should not expose the internal review report domain");
assert.ok(publicUserscript.includes("// @version      2026.08.15.05"), "public userscript should use current technical version");
assert.ok(publicUserscript.includes('DISPLAY_VERSION = "V0.2.13"'), "public userscript should use current display version");
assert.ok(!publicUserscript.includes("审核者备注"), "public userscript should not expose reviewer remark input");
assert.ok(!publicUserscript.includes("reporterName"), "public userscript should not send a user-filled reviewer remark");
assert.ok(publicUserscript.includes("ycfg.mygamemod.com"), "public userscript should point review reports to the current remote admin domain");
assert.ok(publicUserscript.includes("rvw_2c6a205ebff67878f318c01092f020fca98d2e1b5b337ee0"), "public userscript should include the current fixed route code");
assert.ok(!page.includes("每帧最多处理 80 条弹幕"), "install page should not mention a fixed 80-item frame limit");
assert.ok(page.includes("@呆物麋羊"), "user-authored update history should include @呆物麋羊 signature");
assert.ok(!page.includes("@呆物麋羊 更新"), "signature should not include update wording");
assert.ok(home.includes(installLink), "home install links should use packaged userscript install path");
for (const staleHost of staleInstallHosts) {
  assert.ok(!page.includes(staleHost), `page should not include stale install host: ${staleHost}`);
  assert.ok(!home.includes(staleHost), `home should not include stale install host: ${staleHost}`);
}
for (const staleFile of staleInstallFiles) {
  assert.ok(!page.includes(staleFile), `page should not include stale install file: ${staleFile}`);
  assert.ok(!home.includes(staleFile), `home should not include stale install file: ${staleFile}`);
}

console.log("install page verification passed");
