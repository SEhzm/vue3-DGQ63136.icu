<template>
    <div class="install-page">
        <section v-if="!installUnlocked" class="card install-gate">
            <p class="eyebrow">63136 弹幕插件</p>
            <h1>一键安装插件</h1>
            <p class="gate-desc">输入正确答案后继续访问安装教程、安装按钮和更新历史。</p>
            <form class="gate-form" @submit.prevent="unlockInstallPage">
                <label for="install-gate-answer" class="gate-label">冬瓜强意难平的数字</label>
                <div class="gate-input-row">
                    <span class="gate-input-icon" aria-hidden="true">#</span>
                    <input
                        id="install-gate-answer"
                        class="gate-input"
                        v-model.trim="installGateAnswer"
                        inputmode="decimal"
                        autocomplete="off"
                        spellcheck="false"
                        placeholder="请输入答案"
                        :class="{ 'gate-input-invalid': installGateError }"
                    />
                    <button class="gate-submit" type="submit">进入</button>
                </div>
                <p v-if="installGateError" class="gate-error">{{ installGateError }}</p>
                <p v-if="installGateHint" class="gate-hint">
                    <span class="gate-hint-badge">提示</span>{{ installGateHint }}
                </p>
            </form>
        </section>

        <template v-else>
        <section class="card install-hero douyu-hero">
            <div class="hero-body">
                <div class="platform-pill-row">
                    <span class="platform-tag douyu-platform-tag">🐟 斗鱼直播专版</span>
                    <span class="scope-tag douyu-scope-tag">仅生效于 douyu.com</span>
                </div>
                <p class="eyebrow">63136 弹幕插件 · 斗鱼版</p>
                <h1>一键安装插件（斗鱼版）</h1>
                <p class="hero-desc">
                    安装后打开斗鱼直播间，输入框旁会出现“厕纸”按钮，可以搜索、发送、投稿和收藏 63136 烂梗弹幕，并支持审弹幕与直播同步。
                </p>
                <div class="version-row">
                    <span>斗鱼版版本号</span>
                    <strong>{{ currentPluginVersion }}</strong>
                    <em>更新时间：{{ currentPluginUpdatedAt }}</em>
                </div>
            </div>
            <div class="hero-actions">
                <a class="primary-action" :href="userscriptInstallUrl" target="_blank" rel="noopener noreferrer">
                    一键安装斗鱼版
                </a>
                <a class="secondary-action" :href="tampermonkeyUrl" target="_blank" rel="noopener noreferrer">
                    安装油猴管理器
                </a>
                <a class="text-action" :href="greasyForkUrl" target="_blank" rel="noopener noreferrer">
                    打开 Greasy Fork 备用页
                </a>
            </div>
        </section>

        <section class="card install-hero douyin-hero">
            <div class="douyin-hero-body">
                <div class="platform-pill-row">
                    <span class="platform-tag douyin-platform-tag">🎵 抖音直播专版 · 厕纸</span>
                    <span class="scope-tag douyin-scope-tag">仅生效于 live.douyin.com</span>
                    <span class="scope-tag douyin-independent-tag">与斗鱼版独立脚本 · 互不冲突</span>
                </div>
                <p class="eyebrow douyin-eyebrow">新增插件 · 抖音直播专版</p>
                <h2 class="douyin-title">dgq63136 抖音「厕纸」插件（douyin++）</h2>
                <p class="hero-desc">
                    专为抖音直播网页版（<code>live.douyin.com</code>）单独编写：在直播间提供 <strong>dgq63136 悬浮图标</strong>与播放器清晰度旁<strong>“厕纸”</strong>按钮随时打开「dgq63136厕纸（抖音版）」面板；鼠标放在原生飘屏弹幕上时弹幕暂停并显示 <strong>+1</strong> 与 <strong>回复</strong>（自动按 <code>@发送者ID：内容</code> 填入输入框）；默认展示最新 <strong>50 条 dgq63136 烂梗（触底加载下一页）</strong>，支持分类标签、关键词检索发送、顶部充电赞赏及<strong>自动检查更新与一键更新</strong>。
                </p>
                <div class="version-row douyin-version-row">
                    <span>抖音版版本号</span>
                    <strong>{{ douyinPluginVersion }}</strong>
                    <em>更新时间：{{ douyinPluginUpdatedAt }}</em>
                    <span class="douyin-env-tag">支持环境：Tampermonkey 5.5.1 及以上</span>
                </div>
                <div class="douyin-highlights">
                    <span class="douyin-highlight-pill">🧻 页面悬浮图标 &amp; 清晰度旁“厕纸”入口</span>
                    <span class="douyin-highlight-pill">🎈 原生飘屏悬停即停：+1 一键复读 / @回复 填框</span>
                    <span class="douyin-highlight-pill">📜 默认最新 50 条烂梗（触底加载下一页）、搜索发送与一键更新</span>
                </div>
            </div>
            <div class="hero-actions">
                <a
                    class="primary-action douyin-primary-action"
                    :href="douyinUserscriptInstallUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="装有 Tampermonkey 5.5.1+ 的用户点击后会自动弹出安装页"
                >
                    一键安装抖音「厕纸」（推荐）
                </a>
                <a
                    class="secondary-action douyin-secondary-action"
                    :href="douyinUserscriptInstallUrl"
                    download="douyin++.user.js"
                    title="下载 douyin++.user.js 本地脚本文件"
                >
                    下载脚本 (.user.js)
                </a>
                <a class="text-action douyin-text-action" :href="tampermonkeyUrl" target="_blank" rel="noopener noreferrer">
                    安装油猴管理器
                </a>
            </div>
        </section>

        <section class="card platform-diff-card">
            <div class="section-heading">
                <h2>两个版本怎么选？（斗鱼版 vs 抖音「厕纸」版）</h2>
                <p>两套脚本分别匹配各自直播站域名，互不覆盖，可按常看平台单独安装或同时安装。</p>
            </div>
            <div class="platform-diff-grid">
                <div class="diff-col diff-douyu">
                    <div class="diff-col-head">
                        <span class="platform-tag douyu-platform-tag">🐟 斗鱼版</span>
                        <code>dgq63136.user.js</code>
                    </div>
                    <ul>
                        <li><strong>生效页面</strong>：斗鱼直播间（<code>douyu.com</code>）</li>
                        <li><strong>页面入口</strong>：聊天输入框上方“厕纸”按钮</li>
                        <li><strong>核心能力</strong>：搜索、分类、热榜、最近、本地收藏、投稿、审弹幕</li>
                    </ul>
                </div>
                <div class="diff-col diff-douyin">
                    <div class="diff-col-head">
                        <span class="platform-tag douyin-platform-tag">🎵 抖音「厕纸」版</span>
                        <code>douyin++.user.js</code>
                    </div>
                    <ul>
                        <li><strong>生效页面</strong>：抖音直播间（<code>live.douyin.com</code>）</li>
                        <li><strong>页面入口</strong>：右下角悬浮球 + 播放器清晰度旁“厕纸”按钮</li>
                        <li><strong>核心能力</strong>：原生飘屏悬停停驻（+1 / @回复）、最新50条与触底分页、一键更新</li>
                    </ul>
                </div>
            </div>
        </section>

        <section class="card permission-tip">
            <div class="tip-badge">重要提醒</div>
            <div>
                <h2>装完油猴后，把两个权限开关都打开</h2>
                <p>
                    有些浏览器里即使已经装好 Tampermonkey，如果扩展详情里的权限开关没开，插件还是不会运行。
                    先打开下面两个开关，再点上面的“一键安装插件”。
                </p>
                <div class="switch-list">
                    <div v-for="item in requiredSwitches" :key="item.name" class="switch-item">
                        <span></span>
                        <div>
                            <strong>{{ item.name }}</strong>
                            <p>{{ item.desc }}</p>
                        </div>
                    </div>
                </div>
                <div class="permission-guide">
                    <div v-for="step in permissionSteps" :key="step.title" class="permission-step">
                        <span>{{ step.index }}</span>
                        <div>
                            <h3>{{ step.title }}</h3>
                            <p>{{ step.desc }}</p>
                        </div>
                    </div>
                </div>
                <div class="permission-checks">
                    <strong>安装后这样确认：</strong>
                    <ul>
                        <li v-for="item in permissionChecks" :key="item">{{ item }}</li>
                    </ul>
                </div>
            </div>
        </section>

        <section class="card quick-guide">
            <h2>安装顺序</h2>
            <div class="steps">
                <div v-for="step in installSteps" :key="step.title" class="step-item">
                    <span>{{ step.index }}</span>
                    <div>
                        <h3>{{ step.title }}</h3>
                        <p>{{ step.desc }}</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="card history-card">
            <div class="section-heading">
                <h2>更新历史（斗鱼版 &amp; 抖音「厕纸」版）</h2>
                <p>上方为抖音直播「厕纸」当前版本，下方为斗鱼直播版历代迭代记录。</p>
            </div>
            <div class="douyin-history-pin">
                <div class="douyin-history-meta">
                    <span class="platform-tag douyin-platform-tag">🎵 抖音「厕纸」版</span>
                    <strong>{{ douyinPluginVersion }}</strong>
                    <span>更新时间：{{ douyinPluginUpdatedAt }}</span>
                </div>
                <ul>
                    <li>播放器清晰度旁入口、悬浮球与功能面板统一命名为「厕纸（抖音版）」。</li>
                    <li>面板默认加载最新 50 条 dgq63136 烂梗，标签筛选与关键词搜索均支持触底自动加载下一页。</li>
                    <li>支持原生飘屏弹幕悬停暂停（+1 一键发送 / @回复 填框）、请求头透传及一键检查更新。</li>
                </ul>
            </div>
            <div class="history-list">
                <article v-for="item in updateHistory" :key="item.version" class="history-item">
                    <div class="history-meta">
                        <strong>版本号：{{ item.version }}</strong>
                        <span>更新时间：{{ item.updatedAt }}</span>
                    </div>
                    <ul>
                        <li v-for="change in item.changes" :key="change">{{ change }}</li>
                    </ul>
                </article>
            </div>
        </section>
        </template>
    </div>
</template>

<script setup>
import { ref } from 'vue';

/** 冬瓜强意难平的数字 —— 任一命中即放行 */
const INSTALL_GATE_ANSWERS = [70, 17, 0.17, 15, 63136, 9418, 6657];
const installUnlocked = ref(false);
const installGateAnswer = ref('');
const installGateError = ref('');
const installGateWrongCnt = ref(0);
const installGateHint = ref('');
/** 错误到一定次数给点题提示，分级展开 */
const GATE_HINTS = [
    '5EPL rating = ?',
    '团播飞盘🙋‍♂️',
];
const currentPluginVersion = 'V0.2.42';
const currentPluginUpdatedAt = '2026-09-06 01:33';
const userscriptInstallUrl = '/install-files/dgq63136/9b7e2d0a6c4f91d3/dgq63136.user.js?v=202609060133';
const douyinPluginVersion = 'v2026.11.09.07';
const douyinPluginUpdatedAt = '2026-11-09';
const douyinUserscriptInstallUrl = '/douyin++.user.js';
const tampermonkeyUrl = 'https://www.tampermonkey.net/';
const greasyForkUrl =
    'https://greasyfork.org/zh-CN/scripts/511991-dgq63136-cn%E6%96%97%E9%B1%BC%E5%86%AC%E7%93%9C%E5%BC%BA%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86';

const unlockInstallPage = () => {
    const raw = (installGateAnswer.value || '').trim();
    if (raw === '') {
        installGateError.value = '先输入一个数字试试。';
        return;
    }
    const num = Number(raw);
    if (!Number.isNaN(num) && INSTALL_GATE_ANSWERS.some(a => a === num)) {
        installUnlocked.value = true;
        installGateError.value = '';
        installGateHint.value = '';
        return;
    }
    installGateWrongCnt.value += 1;
    installGateError.value = '答案不对，再想想。';
    const cnt = installGateWrongCnt.value;
    if (cnt >= 8) {
        installGateHint.value = GATE_HINTS[1];
    } else if (cnt >= 5) {
        installGateHint.value = GATE_HINTS[0];
    }
};
const installSteps = [
    {
        index: '1',
        title: '先安装油猴管理器',
        desc: '如果浏览器已经装过 Tampermonkey，可以直接跳到下一步；记得先按上方教程把两个权限开关打开。',
    },
    {
        index: '2',
        title: '按平台点击对应安装',
        desc: '看斗鱼选上方蓝卡【一键安装斗鱼版】，看抖音选深色卡【一键安装抖音「厕纸」】，油猴弹窗中点击安装。',
    },
    {
        index: '3',
        title: '进入对应直播间验证',
        desc: '斗鱼直播间聊天框旁出现“厕纸”按钮；抖音直播间右下角有悬浮图标、清晰度旁出现“厕纸”按钮即安装成功。',
    },
];

const requiredSwitches = [
    {
        name: '允许用户脚本 / Allow user scripts',
        desc: '不开这个，Tampermonkey 可能无法运行自己安装的脚本。',
    },
    {
        name: '在 InPrivate 中允许',
        desc: '不开这个，部分浏览器或隐私窗口里插件不会生效。',
    },
];

const permissionSteps = [
    {
        index: '1',
        title: '进入扩展管理页',
        desc: 'Edge 在地址栏输入 edge://extensions；Chrome 在地址栏输入 chrome://extensions，然后按回车。',
    },
    {
        index: '2',
        title: '找到油猴扩展',
        desc: '在扩展列表里找到 Tampermonkey，先确认右侧总开关是开启状态。',
    },
    {
        index: '3',
        title: '进入详细信息',
        desc: '点击 Tampermonkey 卡片上的“详细信息”或“详情”，进入扩展详情页面。',
    },
    {
        index: '4',
        title: '两个开关都打开',
        desc: '在详情页往下找，把“允许用户脚本 / Allow user scripts”和“在 InPrivate 中允许”都打开。',
    },
    {
        index: '5',
        title: '回到本页安装插件',
        desc: '开关打开后，再点击“一键安装插件”，油猴安装页出现后点安装或更新。',
    },
];

const permissionChecks = [
    '【斗鱼版】打开 douyu.com 直播间，聊天输入框旁能看到“厕纸”按钮，点开可见搜索、分类、热榜、最近、收藏、设置。',
    '【抖音版】打开 live.douyin.com 直播间，右下角有悬浮图标且清晰度旁能看到“厕纸”按钮；鼠标放在原生飘屏上会暂停并出现 +1 与 回复。',
    '如果仍未显示，刷新对应直播间页面，或回到扩展管理页确认 Tampermonkey、“允许用户脚本 / Allow user scripts”和“在 InPrivate 中允许”都已开启。',
];

const updateHistory = [
    {
        date: '2026-09-06',
        updatedAt: '2026-09-06 01:33',
        version: 'V0.2.42',
        changes: [
            '优化插件启动兼容，减少和其他斗鱼油猴脚本互相影响。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-21',
        updatedAt: '2026-08-21 23:20',
        version: 'V0.2.41',
        changes: [
            '修复旧识别码导致投稿失败的问题。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-21',
        updatedAt: '2026-08-21 21:48',
        version: 'V0.2.40',
        changes: [
            '修复投稿接口识别异常导致部分用户投稿失败的问题。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-21',
        updatedAt: '2026-08-21 21:41',
        version: 'V0.2.39',
        changes: [
            '优化投稿接口异常提示，减少误解。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-21',
        updatedAt: '2026-08-21 20:39',
        version: 'V0.2.38',
        changes: [
            '优化插件版本同步和安装页更新体验。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-21',
        updatedAt: '2026-08-21 19:05',
        version: 'V0.2.37',
        changes: [
            '优化投稿异常提示和安装版本同步。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-20',
        updatedAt: '2026-08-20 04:31',
        version: 'V0.2.36',
        changes: [
            '优化版本更新识别体验。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-20',
        updatedAt: '2026-08-20 00:11',
        version: 'V0.2.35',
        changes: [
            '优化投稿失败诊断体验。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-18',
        updatedAt: '2026-08-18 17:19',
        version: 'V0.2.34',
        changes: [
            '优化投稿接口兼容体验。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-18',
        updatedAt: '2026-08-18 16:47',
        version: 'V0.2.33',
        changes: [
            '优化投稿失败提示体验。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-18',
        updatedAt: '2026-08-18 16:40',
        version: 'V0.2.32',
        changes: [
            '优化投稿失败提示体验。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-18',
        updatedAt: '2026-08-18 16:23',
        version: 'V0.2.31',
        changes: [
            '优化投稿标签选择体验。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-18',
        updatedAt: '2026-08-18 16:13',
        version: 'V0.2.30',
        changes: [
            '优化投稿标签刷新体验。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-18',
        updatedAt: '2026-08-18 16:07',
        version: 'V0.2.29',
        changes: [
            '优化投稿异常处理体验。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-18',
        updatedAt: '2026-08-18 05:28',
        version: 'V0.2.28',
        changes: [
            '优化投稿重复提示，减少误解。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-18',
        updatedAt: '2026-08-18 05:22',
        version: 'V0.2.27',
        changes: [
            '优化投稿重复提示，减少误解。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-17',
        updatedAt: '2026-08-17 23:30',
        version: 'V0.2.26',
        changes: [
            '优化热榜加载体验。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-17',
        updatedAt: '2026-08-17 23:18',
        version: 'V0.2.25',
        changes: [
            '优化热榜排序体验。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-17',
        updatedAt: '2026-08-17 23:05',
        version: 'V0.2.24',
        changes: [
            '优化热榜实时显示体验。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-17',
        updatedAt: '2026-08-17 22:40',
        version: 'V0.2.23',
        changes: [
            '优化插件更新检测体验。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-17',
        updatedAt: '2026-08-17 22:25',
        version: 'V0.2.22',
        changes: [
            '优化热榜数据加载方式。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-17',
        updatedAt: '2026-08-17 22:10',
        version: 'V0.2.21',
        changes: [
            '优化热榜显示体验。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-17',
        updatedAt: '2026-08-17 20:50',
        version: 'V0.2.20',
        changes: [
            '热榜新增实时弹幕和 5 分钟热度榜入口。',
            '@呆物麋羊',
        ],
    },
    {
        date: '2026-08-17',
        updatedAt: '2026-08-17 20:25',
        version: 'V0.2.19',
        changes: [
            '修复更新检测失败的问题。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.18',
        updatedAt: '2026-08-17 19:22',
        changes: [
            '优化播放器区域提示显示体验。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.17',
        updatedAt: '2026-08-17 19:13',
        changes: [
            '新增播放器同步时间入口。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.16',
        updatedAt: '2026-08-15 21:29',
        changes: [
            '优化弹幕操作入口的稳定性。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.15',
        updatedAt: '2026-08-15 17:28',
        changes: [
            '优化弹幕操作体验。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.14',
        updatedAt: '2026-08-15 17:00',
        changes: [
            '优化弹幕操作体验。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.13',
        updatedAt: '2026-08-15 16:20',
        changes: [
            '优化公开更新说明，改为更简洁的功能概述。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.12',
        updatedAt: '2026-08-15 15:52',
        changes: [
            '优化弹幕互动操作的响应体验。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.11',
        updatedAt: '2026-08-14 23:40',
        changes: [
            '完善特殊情况下的弹幕处理流程。',
            '提升相关功能的稳定性和安全性。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.10',
        updatedAt: '2026-08-14 22:50',
        changes: [
            '优化弹幕识别与交互体验。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.9',
        updatedAt: '2026-08-14 22:20',
        changes: [
            '优化弹幕操作入口的加载和响应速度。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.8',
        updatedAt: '2026-08-14 15:57',
        changes: [
            '优化异常提示，提升问题定位体验。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.7',
        updatedAt: '2026-08-13 20:55',
        changes: [
            '优化插件设置项，减少使用步骤。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.6',
        updatedAt: '2026-08-13 20:20',
        changes: [
            '完善弹幕管理相关功能，提升整体稳定性。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.5',
        updatedAt: '2026-08-13 19:05',
        changes: [
            '优化插件设置与使用流程。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.4',
        updatedAt: '2026-08-13 18:50',
        changes: [
            '完善相关功能接入准备。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.3',
        updatedAt: '2026-08-13 18:30',
        changes: [
            '优化功能设置，减少使用步骤。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.1',
        updatedAt: '2026-08-13 09:46',
        changes: [
            '优化版本提示和更新体验。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.2.0',
        updatedAt: '2026-08-13 00:33',
        changes: [
            '优化版本显示和更新提示。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.1.9',
        updatedAt: '2026-08-12 23:35',
        changes: [
            '优化更新提示窗口，减少对页面操作的影响。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.1.8',
        updatedAt: '2026-08-12 22:55',
        changes: [
            '新增版本检测和更新提醒。',
            '优化重复打开面板时的检测体验。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.1.7',
        updatedAt: '2026-08-12 18:45',
        changes: [
            '优化直播间启动速度和使用体验。',
            '减少插件平时的资源占用。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.1.6',
        updatedAt: '2026-08-12 18:10',
        changes: [
            '优化弹幕互动功能的处理方式。',
            '进一步降低插件运行时的资源占用。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.1.5',
        updatedAt: '2026-08-12 17:30',
        changes: [
            '优化弹幕操作入口的加载速度。',
            '降低页面变化较多时的额外开销。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.1.4',
        updatedAt: '2026-08-12 04:45',
        changes: [
            '优化弹幕区域的兼容性和显示效果。',
            '减少与页面其他功能的样式影响。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.1.3',
        updatedAt: '2026-08-12 04:20',
        changes: [
            '优化弹幕发送内容的识别，避免出现多余文字。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.1.2',
        updatedAt: '2026-08-12 03:45',
        changes: [
            '优化弹幕操作入口的显示范围。',
            '减少不相关内容上的干扰。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.1.1',
        updatedAt: '2026-08-12 03:35',
        changes: [
            '优化更新按钮和提示窗口体验。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.1.0',
        updatedAt: '2026-08-12 03:05',
        changes: [
            '优化热榜、使用统计、布局模式和窄屏显示体验。',
            '完善弹幕互动入口。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.0.9',
        updatedAt: '2026-08-12 01:46',
        changes: [
            '重排插件浮窗首屏，顶部直接显示 63136 弹幕库和 V0.0.9 版本号。',
            '搜索 / 分类 / 热榜 / 最近 / 收藏 / 设置入口前置，快捷标签、随机和查看及投稿分类更明显。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.0.8',
        updatedAt: '2026-08-12 00:43',
        changes: [
            '优化版本兼容和更新提示。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.0.7',
        updatedAt: '2026-08-12 00:00',
        changes: [
            '优化版本更新识别。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.0.6',
        updatedAt: '2026-08-11 23:21',
        changes: [
            '完成浮窗效率改造，新增搜索、分类、热榜、最近、收藏、设置六个入口。',
            '新增最近使用、随机来一条、快捷标签、收藏分类筛选、发送前确认、快捷键和紧凑模式。',
            '更新提示改为显示当前版本、最新版本和更新内容卡片。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.0.5',
        updatedAt: '2026-08-11 21:11',
        changes: [
            '分类浏览列表显示接口返回的投稿时间，热梗列表显示接口返回的热门时间。',
            '时间统一展示为年-月-日 时:分，方便判断弹幕更新时间。',
        ],
    },
    {
        version: 'V0.0.4',
        updatedAt: '2026-08-11 21:03',
        changes: [
            '把面板“投稿分类”改为“查看及投稿分类”。',
            '选择分类后可以直接分页查看该分类弹幕，每页显示 5 条。',
        ],
    },
    {
        version: 'V0.0.3',
        updatedAt: '2026-08-11 20:36',
        changes: [
            '新增热门弹幕折叠入口。',
            '支持查看 24 小时热门和 7 天热门弹幕。',
        ],
    },
    {
        version: 'V0.0.2',
        updatedAt: '2026-08-11 18:19',
        changes: [
            '优化分类菜单和弹幕增强体验。',
        ],
    },
    {
        version: 'V0.0.1',
        updatedAt: '2026-08-11 16:59',
        changes: [
            '新增一键投稿、本地收藏和更新提示。',
        ],
    },
];
</script>

<style scoped>
.install-page {
    display: grid;
    gap: 14px;
}

/* ===== 安装门禁：意难平数字闸口 ===== */
.install-gate {
    display: grid;
    gap: 4px;
    border-top: 3px solid #1976d2;
    padding: 22px 22px 24px;
}

.gate-desc {
    margin-top: 6px;
    color: #5b6470;
    font-size: 14px;
    line-height: 1.6;
}

.gate-form {
    margin-top: 16px;
    display: grid;
    gap: 10px;
}

.gate-label {
    font-size: 14px;
    font-weight: 700;
    color: #125ea8;
    letter-spacing: 0.2px;
}

.gate-input-row {
    display: grid;
    grid-template-columns: 44px 1fr auto;
    align-items: stretch;
    border-radius: 10px;
    background: #f3f7ff;
    border: 1.5px solid #cfe0ff;
    box-shadow: 0 2px 10px rgba(25, 118, 210, 0.06);
    overflow: hidden;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.gate-input-row:focus-within {
    border-color: #1976d2;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(25, 118, 210, 0.12), 0 4px 14px rgba(25, 118, 210, 0.14);
}

.gate-input-row:has(.gate-input-invalid) {
    border-color: #e54d3c;
    background: #fff5f3;
    box-shadow: 0 0 0 4px rgba(229, 77, 60, 0.10);
    animation: gate-shake 0.4s ease;
}

@keyframes gate-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-3px); }
}

.gate-input-icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(180deg, #eaf2ff, #d8e8ff);
    color: #1976d2;
    font-weight: 800;
    font-size: 18px;
    border-right: 1.5px solid #cfe0ff;
}

.gate-input {
    border: none;
    background: transparent;
    outline: none;
    padding: 0 14px;
    height: 50px;
    font-size: 17px;
    font-weight: 600;
    color: #1a2230;
    letter-spacing: 1px;
    font-variant-numeric: tabular-nums;
}

.gate-input::placeholder {
    color: #9aa6b6;
    font-weight: 500;
    letter-spacing: 0;
}

.gate-submit {
    border: none;
    cursor: pointer;
    padding: 0 22px;
    background: linear-gradient(180deg, #1e88e5, #1565c0);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 2px;
    transition: filter 0.18s ease, transform 0.18s ease;
}

.gate-submit:hover {
    filter: brightness(1.06);
}

.gate-submit:active {
    transform: translateY(1px);
}

.gate-error {
    color: #e54d3c;
    font-size: 13px;
    font-weight: 600;
    padding-left: 2px;
}

.gate-hint {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2px;
    padding: 10px 12px;
    border-radius: 8px;
    color: #7a5a06;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.3px;
    background: #fff8e6;
    border: 1px dashed #f0c44a;
    animation: gate-hint-in 0.32s ease;
}

@keyframes gate-hint-in {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
}

.gate-hint-badge {
    flex: none;
    padding: 2px 8px;
    border-radius: 999px;
    background: #f0c44a;
    color: #5a4400;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0;
}

@media (max-width: 640px) {
    .gate-input-row {
        grid-template-columns: 40px 1fr auto;
    }
    .gate-submit {
        padding: 0 16px;
    }
}


.install-hero {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 18px;
}

.permission-tip {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 14px;
    align-items: start;
    border-left: 4px solid #1976d2;
}

.permission-guide {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
    margin-top: 14px;
}

.switch-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 12px;
}

.switch-item {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 10px;
    align-items: center;
    min-height: 74px;
    border: 1px solid #d7eadc;
    border-radius: 6px;
    padding: 10px 12px;
    background: #f7fff9;
}

.switch-item span {
    position: relative;
    width: 34px;
    height: 20px;
    border-radius: 999px;
    background: #36b36b;
}

.switch-item span::after {
    content: "";
    position: absolute;
    top: 3px;
    right: 3px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
}

.switch-item strong {
    display: block;
    color: #1f7a42;
    font-size: 14px;
}

.permission-step {
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr);
    gap: 9px;
    min-height: 112px;
    border: 1px solid #dcecff;
    border-radius: 6px;
    padding: 10px;
    background: #f7fbff;
}

.permission-step span {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #e8f2ff;
    color: #125ea8;
    font-weight: 800;
}

.permission-checks {
    margin-top: 12px;
    border-radius: 6px;
    padding: 10px 12px;
    background: #fffaf0;
    color: #4b3a12;
}

.permission-checks strong {
    display: block;
    margin-bottom: 6px;
}

.permission-checks ul {
    margin: 0;
    padding-left: 18px;
    line-height: 1.6;
}

.tip-badge {
    width: fit-content;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(25, 118, 210, 0.1);
    color: #1976d2;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
}

.eyebrow {
    color: #1976d2;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 8px;
}

h1,
h2,
h3,
p {
    margin: 0;
}

h1 {
    color: #111;
    font-size: 32px;
    line-height: 1.2;
}

h2 {
    color: #111;
    font-size: 22px;
    line-height: 1.25;
}

h3 {
    color: #111;
    font-size: 15px;
    line-height: 1.3;
}

.hero-desc {
    max-width: 760px;
    margin-top: 10px;
    color: #333;
    font-size: 16px;
    line-height: 1.7;
}

.version-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-top: 16px;
}

.version-row span,
.version-row em {
    color: #555;
    font-size: 13px;
    font-style: normal;
}

.version-row strong {
    border-radius: 5px;
    background: #e8f2ff;
    color: #125ea8;
    font-size: 16px;
    padding: 6px 10px;
}

.hero-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 190px;
}

.primary-action,
.secondary-action,
.text-action {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-height: 42px;
    border-radius: 5px;
    padding: 0 16px;
    font-weight: 700;
    white-space: nowrap;
}

.primary-action {
    color: #fff;
    background: #1976d2;
}

.secondary-action {
    color: #1976d2;
    border: 1px solid #1976d2;
    background: #fff;
}

.text-action {
    color: #555;
    background: #f3f5f7;
}

.hero-body {
    flex: 1 1 320px;
    min-width: 0;
}

.douyu-hero {
    border-left: 5px solid #1976d2;
    background: linear-gradient(135deg, #ffffff 0%, #f3f8ff 100%);
}

.platform-pill-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

.platform-tag {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.2px;
}

.douyu-platform-tag {
    background: #1976d2;
    color: #ffffff;
}

.douyin-platform-tag {
    background: linear-gradient(135deg, #fe2c55, #e11d48);
    color: #ffffff;
}

.scope-tag {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
}

.douyu-scope-tag {
    background: #e8f2ff;
    color: #125ea8;
}

.douyin-scope-tag {
    background: rgba(37, 244, 238, 0.14);
    border: 1px solid rgba(37, 244, 238, 0.36);
    color: #67e8f9;
}

.douyin-independent-tag {
    background: rgba(255, 255, 255, 0.09);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: #e2e8f0;
}

.douyin-hero {
    border: 1px solid rgba(37, 244, 238, 0.35);
    border-left: 5px solid #fe2c55;
    background: linear-gradient(135deg, #161823 0%, #1d2233 62%, #132830 100%);
    color: #f8fafc;
    box-shadow: 0 10px 26px rgba(15, 23, 42, 0.18);
}

.douyin-hero-body {
    flex: 1 1 320px;
    min-width: 0;
}

.douyin-eyebrow {
    color: #fda4af;
}

.douyin-title {
    color: #ffffff;
    font-size: 26px;
    line-height: 1.25;
}

.douyin-hero .hero-desc {
    color: #cbd5e1;
}

.douyin-hero .hero-desc strong {
    color: #ffffff;
}

.douyin-hero .hero-desc code {
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(37, 244, 238, 0.16);
    color: #67e8f9;
    font-size: 14px;
}

.douyin-version-row span,
.douyin-version-row em {
    color: #94a3b8;
}

.douyin-version-row strong {
    background: rgba(16, 185, 129, 0.22);
    border: 1px solid rgba(52, 211, 153, 0.4);
    color: #6ee7b7;
}

.douyin-env-tag {
    padding: 4px 10px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.09);
    color: #e2e8f0;
}

.douyin-highlights {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
}

.douyin-highlight-pill {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(37, 244, 238, 0.28);
    color: #e2e8f0;
    font-size: 13px;
    font-weight: 500;
}

.douyin-hero .primary-action,
.douyin-hero .secondary-action,
.douyin-hero .text-action {
    text-decoration: none;
    box-sizing: border-box;
    transition: filter 0.16s ease, transform 0.16s ease;
}

.douyin-hero .primary-action:hover,
.douyin-hero .secondary-action:hover,
.douyin-hero .text-action:hover {
    filter: brightness(1.06);
    transform: translateY(-1px);
}

.douyin-primary-action {
    background: linear-gradient(135deg, #fe2c55, #e11d48);
    box-shadow: 0 4px 14px rgba(254, 44, 85, 0.35);
}

.douyin-secondary-action {
    color: #67e8f9;
    border-color: rgba(37, 244, 238, 0.52);
    background: rgba(37, 244, 238, 0.1);
}

.douyin-text-action {
    background: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
}

.platform-diff-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 12px;
}

.diff-col {
    border-radius: 8px;
    padding: 12px 14px;
    border: 1px solid #e5e7eb;
    background: #fafafa;
}

.diff-douyu {
    border-left: 4px solid #1976d2;
    background: #f5f9ff;
}

.diff-douyin {
    border-left: 4px solid #fe2c55;
    background: #f8fafc;
}

.diff-col-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
}

.diff-col-head code {
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.06);
    color: #374151;
}

.diff-col ul {
    margin: 0;
    padding-left: 18px;
    font-size: 13px;
    line-height: 1.65;
    color: #374151;
}

.diff-col code {
    font-size: 12px;
    padding: 1px 5px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.05);
}

.douyin-history-pin {
    margin-top: 12px;
    padding: 12px 14px;
    border-radius: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #fe2c55;
}

.douyin-history-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}

.douyin-history-meta strong {
    color: #059669;
    font-size: 15px;
}

.douyin-history-meta span:last-child {
    color: #64748b;
    font-size: 13px;
}

.douyin-history-pin ul {
    margin: 0;
    padding-left: 18px;
    color: #334155;
    line-height: 1.65;
    font-size: 13.5px;
}

html.dark .douyu-hero {
    background: linear-gradient(135deg, #141c27 0%, #162233 100%);
}

html.dark .douyu-hero h1,
html.dark .quick-guide h2,
html.dark .permission-tip h2,
html.dark .history-card h2,
html.dark .platform-diff-card h2,
html.dark .step-item h3,
html.dark .permission-step h3 {
    color: #f1f5f9;
}

html.dark .douyu-hero .hero-desc,
html.dark .step-item p,
html.dark .switch-item p,
html.dark .permission-step p,
html.dark .section-heading p,
html.dark .history-item ul,
html.dark .version-row span,
html.dark .version-row em {
    color: #cbd5e1;
}

html.dark .diff-col,
html.dark .douyin-history-pin,
html.dark .step-item,
html.dark .permission-step,
html.dark .switch-item {
    background: #1a2330;
    border-color: #2c394b;
}

html.dark .diff-col ul,
html.dark .douyin-history-pin ul {
    color: #cbd5e1;
}

html.dark .diff-col code,
html.dark .diff-col-head code {
    background: rgba(255, 255, 255, 0.12);
    color: #e2e8f0;
}

html.dark .douyu-scope-tag {
    background: rgba(56, 189, 248, 0.18);
    color: #7dd3fc;
}

html.dark .permission-checks {
    background: #1f242d;
    color: #e2e8f0;
}

.steps {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-top: 12px;
}

.step-item {
    display: grid;
    grid-template-columns: 32px minmax(0, 1fr);
    gap: 10px;
    min-height: 96px;
    border: 1px solid #e6eef7;
    border-radius: 6px;
    padding: 12px;
    background: #fbfdff;
}

.step-item span {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #1976d2;
    color: #fff;
    font-weight: 700;
}

.step-item p,
.switch-item p,
.permission-step p,
.section-heading p {
    margin-top: 6px;
    color: #555;
    font-size: 13px;
    line-height: 1.55;
}

.history-list {
    display: grid;
    gap: 10px;
    margin-top: 12px;
}

.history-item {
    display: grid;
    grid-template-columns: 210px minmax(0, 1fr);
    gap: 14px;
    border-top: 1px solid #edf0f2;
    padding-top: 12px;
}

.history-meta {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.history-meta strong {
    color: #125ea8;
    font-size: 15px;
}

.history-meta span {
    color: #777;
    font-size: 13px;
}

.history-item ul {
    margin: 0;
    padding-left: 18px;
    color: #333;
    line-height: 1.65;
}

@media (max-width: 720px) {
    .install-hero,
    .permission-tip,
    .permission-guide,
    .switch-list,
    .platform-diff-grid,
    .steps,
    .history-item {
        grid-template-columns: 1fr;
    }

    h1 {
        font-size: 26px;
    }

    .douyin-title {
        font-size: 22px;
    }

    .hero-actions {
        min-width: 0;
    }
}
</style>
