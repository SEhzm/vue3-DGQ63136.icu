<template>
    <div class="install-page">
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
    </div>
</template>

<script setup>
const currentPluginVersion = 'V0.1.4';
const currentPluginUpdatedAt = '2026-08-12 04:45';
const userscriptInstallUrl =
    'https://cdn.hguofichp.cn/dgq63136.user.js';
const tampermonkeyUrl = 'https://www.tampermonkey.net/';
const greasyForkUrl =
    'https://greasyfork.org/zh-CN/scripts/511991-dgq63136-cn%E6%96%97%E9%B1%BC%E5%86%AC%E7%93%9C%E5%BC%BA%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86';

const installSteps = [
    {
        index: '1',
        title: '先安装油猴管理器',
        desc: '如果浏览器已经装过 Tampermonkey，可以直接跳到下一步。',
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

const updateHistory = [
    {
        version: 'V0.1.4',
        updatedAt: '2026-08-12 04:45',
        changes: [
            '缩小弹幕增强监听范围，只监听弹幕列表和弹幕详情区域，避免影响 DouyuEx 修改播放器。',
            '列表快捷按钮样式改为插件自有选择器，减少和斗鱼/DouyuEx 页面样式冲突。',
            'Greasy Fork 技术 @version 更新为 2026.08.12.08。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.1.3',
        updatedAt: '2026-08-12 04:20',
        changes: [
            '修复点击斗鱼弹幕列表 +1 时，把插件按钮文字“投/+1”一起发出去的问题。',
            'Greasy Fork 技术 @version 更新为 2026.08.12.07。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.1.2',
        updatedAt: '2026-08-12 03:45',
        changes: [
            '修复斗鱼弹幕列表快捷按钮显示位置，只给普通聊天弹幕显示投 / +1。',
            '公告、欢迎提示、直播间规则、看点卡片等非普通弹幕不再显示投 / +1。',
            'Greasy Fork 技术 @version 更新为 2026.08.12.06。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.1.1',
        updatedAt: '2026-08-12 03:35',
        changes: [
            '顶部“更新”按钮改为先检测当前插件版本，再弹出提示小窗口。',
            '检测到新版本时才可以点击“更新”，没有新版本时更新按钮不可点击。',
            '提示小窗口保留“访问”按钮，可以直接打开插件网站。',
            'Greasy Fork 技术 @version 更新为 2026.08.12.05。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.1.0',
        updatedAt: '2026-08-12 03:05',
        changes: [
            '按版本规则从 V0.0.9 进位到 V0.1.0。',
            '热榜弹幕已经来自弹幕库，移除热榜里的投稿按钮，只保留发送和收藏。',
            '插件内点击复制或发送成功后，会调用网站现有计数接口，方便后端热门统计使用。',
            '设置里的布局模式改为标准 / 紧凑按钮，避免原生下拉显示不完整。',
            '恢复斗鱼弹幕列表每条弹幕后面的投 / +1 快捷按钮。',
            '修复插件浮窗在窄屏下快捷标签、筛选按钮等右侧元素被裁切的问题。',
            'Greasy Fork 技术 @version 更新为 2026.08.12.04。',
            '@呆物麋羊',
        ],
    },
    {
        version: 'V0.0.9',
        updatedAt: '2026-08-12 01:46',
        changes: [
            '重排插件浮窗首屏，顶部直接显示 63136 弹幕库和 V0.0.9 版本号。',
            '搜索 / 分类 / 热榜 / 最近 / 收藏 / 设置入口前置，快捷标签、随机和查看及投稿分类更明显。',
            'Greasy Fork 技术 @version 更新为 2026.08.12.02。',
        ],
    },
    {
        version: 'V0.0.8',
        updatedAt: '2026-08-12 00:43',
        changes: [
            '兼容 Greasy Fork 线上旧日期版本，脚本内部 @version 改为 2026.08.12.01，避免再次出现版本号未增加提示。',
            '插件面板和网站安装页继续显示用户版本 V0.0.8。',
        ],
    },
    {
        version: 'V0.0.7',
        updatedAt: '2026-08-12 00:00',
        changes: [
            '递增 Greasy Fork 脚本版本号到 0.0.7，解决代码变更后 @version 未增加导致用户无法自动更新的问题。',
            '同步插件面板显示版本为 V0.0.7。',
        ],
    },
    {
        version: 'V0.0.6',
        updatedAt: '2026-08-11 23:21',
        changes: [
            '完成浮窗效率改造，新增搜索、分类、热榜、最近、收藏、设置六个入口。',
            '新增最近使用、分类排序参数、随机来一条、快捷标签、热度详情、收藏分类筛选、发送前确认、快捷键和紧凑模式。',
            '更新提示改为显示当前版本、最新版本和更新内容卡片。',
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
            '投稿分类改为插件内部菜单。',
            '旧默认分类自动迁移为“喷冬瓜强”，并优化弹幕增强监听。',
        ],
    },
    {
        version: 'V0.0.1',
        updatedAt: '2026-08-11 16:59',
        changes: [
            '新增弹幕一键投稿，斗鱼弹幕旁和搜索结果里都可以投稿到 63136。',
            '新增本地收藏，喜欢的弹幕可保存到当前浏览器油猴数据里。',
            '新增插件更新提示，远端版本更新时在插件面板顶部提醒。',
            '修复更新跳转地址双 https 问题。',
        ],
    },
];
</script>

<style scoped>
.install-page {
    display: grid;
    gap: 14px;
}

:global(.chat-room-draggable),
:global(.aplayer),
:global(.version) {
    display: none !important;
}

.install-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 18px;
    align-items: center;
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
