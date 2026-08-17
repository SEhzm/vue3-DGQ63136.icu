import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const root = resolve(import.meta.dirname, "..");
const constants = readFileSync(resolve(root, "src/constants/backend.ts"), "utf8");
const page = readFileSync(resolve(root, "src/views/MainLayout/components/Tampermonkey.vue"), "utf8");
const homeIntro = readFileSync(resolve(root, "src/components/home/homeIntro.vue"), "utf8");
const publicUserscript = readFileSync(resolve(root, "public/install-files/dgq63136/9b7e2d0a6c4f91d3/dgq63136.user.js"), "utf8");

assert.ok(constants.includes("path: '/Tampermonkey'"), "left menu should include Tampermonkey route");
assert.ok(constants.includes("text: '一键安装插件'"), "left menu label should be 一键安装插件");
assert.ok(desktopSidebar.includes("@click=\"navigateTo(category.path)\""), "desktop sidebar should use explicit router push for menu clicks");
assert.ok(desktopSidebar.includes("useRouter"), "desktop sidebar should import useRouter");
assert.ok(desktopSidebar.includes("z-index: 1100"), "desktop sidebar should stay above home content overlays");
assert.ok(homeIntro.includes('<RouterLink to="/Tampermonkey">点击下载</RouterLink>'), "home download link should open install page");
assert.ok(!homeIntro.includes('href="https://dgq63136.cn/dgq63136.user.js"'), "home intro should not directly link to userscript download");

assert.ok(page.includes("installUnlocked"), "install page should hide content behind a simple question gate");
assert.ok(page.includes("冬瓜强意难平的数字"), "install page should show the gate question");
assert.ok(page.includes("INSTALL_GATE_ANSWER = '70'"), "install page gate answer should be 70");
assert.ok(!page.includes("sessionStorage"), "install page should ask for the answer every time it is opened");
assert.ok(page.includes("v-if=\"!installUnlocked\"") && page.includes("v-else"), "install content should be hidden before unlock");
assert.ok(page.includes("currentPluginVersion = 'V0.2.25'"), "install page should show current display version");
assert.ok(page.includes("currentPluginUpdatedAt = '2026-08-17 23:18'"), "install page should show current update time");
assert.ok(page.includes("/dgq63136.user.js?v=202608172318"), "install button should use cache-busted packaged userscript path");
assert.ok(page.includes("安装油猴管理器"), "page should have Tampermonkey install entry");
assert.ok(page.includes("允许用户脚本") && page.includes("Allow user scripts"), "page should remind users to enable user scripts");
assert.ok(page.includes("在 InPrivate 中允许"), "page should remind users to enable InPrivate access");
assert.ok(page.includes("version: 'V0.2.25'") && page.includes("version: 'V0.2.17'"), "history should include recent plugin versions");
assert.ok(page.includes("@呆物麋羊"), "user-authored update history should include @呆物麋羊 signature");
assert.ok(!page.includes("@呆物麋羊 更新"), "signature should not include update wording");
assert.ok(!page.includes("ycfg.mygamemod.com"), "install page history should not expose internal review report domain");

assert.ok(publicUserscript.includes("// @version      2026.08.17.09"), "public userscript should use current technical version");
assert.ok(publicUserscript.includes('DISPLAY_VERSION = "V0.2.25"'), "public userscript should use current display version");
assert.ok(!publicUserscript.includes("审核者备注"), "public userscript should not expose reviewer remark input");

console.log("install page verification passed");
assert.ok(!home.includes("dgq63136.user.js"), "home should not expose old userscript direct links");

assert.ok(publicUserscript.includes("// @connect      dgq63136.cn"), "public userscript should allow update checks against dgq63136.cn");

assert.ok(publicUserscript.includes('HOTWALL_STREAM'), 'public userscript should include hotwall stream path');
assert.ok(publicUserscript.includes('"realtime"'), 'public userscript should render realtime hot tab');
assert.ok(publicUserscript.includes('"five"'), 'public userscript should render five-minute hot tab');
assert.ok(publicUserscript.includes('Number(right?.time || 0) - Number(left?.time || 0)'), 'realtime hotwall should sort newest first');