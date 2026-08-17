<template>
    <div class="install-page">
        <section v-if="!installUnlocked" class="card install-gate">
            <p class="eyebrow">63136 弹幕插件</p>
            <h1>一键安装插件</h1>
            <p class="gate-desc">输入正确答案后继续访问安装教程、安装按钮和更新历史。</p>
            <form class="gate-form" @submit.prevent="unlockInstallPage">
                <label for="install-gate-answer">冬瓜强意难平的数字</label>
                <div class="gate-input-row">
                    <input
                        id="install-gate-answer"
                        v-model.trim="installGateAnswer"
                        inputmode="numeric"
                        autocomplete="off"
                        placeholder="请输入答案"
                    />
                    <button type="submit">进入</button>
                </div>
                <p v-if="installGateError" class="gate-error">{{ installGateError }}</p>
            </form>
        </section>

        <template v-else>
        <section class="card install-hero">
            <div>
                <p class="eyebrow">63136 弹幕插件</p>
                <h1>一键安装插件</h1>
                <p class="hero-desc">
                    安装后打开斗鱼直播间，输入框旁会出现“厕纸”按钮，可以搜索、发送、投稿和收藏 63136 烂梗弹幕。
                </p>
                <div class="version-row">
                    <span>当前插件版本号</span>
                    <strong>{{ currentPluginVersion }}</strong>
                    <em>更新时间：{{ currentPluginUpdatedAt }}</em>
                </div>
            </div>
            <div class="hero-actions">
                <a class="primary-action" :href="userscriptInstallUrl" target="_blank" rel="noopener noreferrer">
                    一键安装插件
                </a>
                <a class="secondary-action" :href="tampermonkeyUrl" target="_blank" rel="noopener noreferrer">
                    安装油猴管理器
                </a>
                <a class="text-action" :href="greasyForkUrl" target="_blank" rel="noopener noreferrer">
                    打开 Greasy Fork 备用页
                </a>
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
                <h2>更新历史</h2>
                <p>按插件和网站可见版本整理，方便判断要不要更新。</p>
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

const INSTALL_GATE_ANSWER = '70';
const installUnlocked = ref(false);
const installGateAnswer = ref('');
const installGateError = ref('');
const currentPluginVersion = 'V0.2.21';
const currentPluginUpdatedAt = '2026-08-17 22:10';
const userscriptInstallUrl = '/install-files/dgq63136/9b7e2d0a6c4f91d3/dgq63136.user.js?v=202608172210';
const tampermonkeyUrl = 'https://www.tampermonkey.net/';
const greasyForkUrl =
    'https://greasyfork.org/zh-CN/scripts/511991-dgq63136-cn%E6%96%97%E9%B1%BC%E5%86%AC%E7%93%9C%E5%BC%BA%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86';

const unlockInstallPage = () => {
    if (installGateAnswer.value === INSTALL_GATE_ANSWER) {
        installUnlocked.value = true;
        installGateError.value = '';
        return;
    }
    installGateError.value = '答案不对，再想想。';
};
const installSteps = [
    {
        index: '1',
        title: '先安装油猴管理器',
        desc: '如果浏览器已经装过 Tampermonkey，可以直接跳到下一步；记得先按上方教程把两个权限开关打开。',
    },
    {
        index: '2',
        title: '点击一键安装插件',
        desc: '浏览器会打开 .user.js 安装页，在油猴确认页点击安装即可。',
    },
    {
        index: '3',
        title: '回到斗鱼直播间验证',
        desc: '打开斗鱼直播间，输入框旁出现“厕纸”按钮就说明安装成功。',
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
    '打开斗鱼直播间，聊天输入框旁能看到“厕纸”按钮。',
    '点开“厕纸”能看到搜索、分类、热榜、最近、收藏、设置。',
    '如果仍然没有显示，刷新斗鱼直播间，或回到扩展管理页确认 Tampermonkey、“允许用户脚本 / Allow user scripts”和“在 InPrivate 中允许”都已开启。',
];

const updateHistory = [
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

@media (max-width: 600px) {
    .install-hero,
    .permission-tip,
    .permission-guide,
    .switch-list,
    .steps,
    .history-item {
        grid-template-columns: 1fr;
    }

    h1 {
        font-size: 26px;
    }

    .hero-actions {
        min-width: 0;
    }
}
</style>
