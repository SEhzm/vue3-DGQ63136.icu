// ==UserScript==
// @name         dgq63136.cn斗鱼冬瓜强烂梗收集
// @namespace    http://tampermonkey.net/
// @version      2026.08.17.09
// @description  在斗鱼直播间 63136 添加搜索、发送、分类排序、随机、最近、本地收藏、审弹幕和版本更新提示
// @author       dgq63136.cn
// @match        https://www.douyu.com/*
// @match        https://www.douyu.com
// @match        https://www.douyu.com/room/*
// @include      https://*.douyu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_info
// @grant        unsafeWindow
// @connect      hguofichp.cn
// @connect      update.greasyfork.org
// @connect      ycfg.mygamemod.com
// @connect      dgq63136.cn
// @icon         https://apic.douyucdn.cn/upload/avatar_v3/201808/e2b4d01edd7dd82f44efeb434a0d3a86_big.jpg
// @license      MIT
// @downloadURL https://dgq63136.cn/install-files/dgq63136/9b7e2d0a6c4f91d3/dgq63136.user.js
// @updateURL https://dgq63136.cn/install-files/dgq63136/9b7e2d0a6c4f91d3/dgq63136.user.js
// ==/UserScript==

(function () {
    "use strict";

    const CURRENT_VERSION = GM_info?.script?.version || "0";
    const DISPLAY_VERSION = "V0.2.25";
    const API_BASE_URL = "https://hguofichp.cn:10086";
    const API_AUTH_HEADER = "eAR48ZFJwfRTy6SyQPFj";
    const API_PATHS = {
        QUERY_MEME: "/dgq/Query",
        SUBMIT_MEME: "/dgq/submission",
        DICT_LIST: "/dgq/dictList",
        PAGE_MEME: "/dgq/Page",
        RANDOM_MEME: "/dgq/random",
        INCREASE_COPY_COUNT: "/dgq/addCnt",
        HOT_MEME_24H: "/dgq/hotBarrageOf24H",
        HOT_MEME_7D: "/dgq/hotBarrageOf7Day",
        HOTWALL_STREAM: "/dgq/hotwall/stream"
    };
    const UPDATE_SOURCE_URL = "https://dgq63136.cn/install-files/dgq63136/9b7e2d0a6c4f91d3/dgq63136.user.js";
    const UPDATE_SCRIPT_URL = "https://dgq63136.cn/install-files/dgq63136/9b7e2d0a6c4f91d3/dgq63136.user.js";
    const UPDATE_PAGE_URL = "https://dgq63136.cn/#/Tampermonkey";
    const REVIEW_REPORT_URL = "https://ycfg.mygamemod.com/api/dgq63136/review/rvw_2c6a205ebff67878f318c01092f020fca98d2e1b5b337ee0";
    const REVIEW_ROUTE_CODE = "rvw_2c6a205ebff67878f318c01092f020fca98d2e1b5b337ee0";
    const SITE_TOKEN_KEY = "DGQ63136_SITE_TOKEN_V1";
    const FAVORITES_KEY = "DGQ63136_FAVORITES_V1";
    const RECENTS_KEY = "DGQ63136_RECENTS_V1";
    const SETTINGS_KEY = "DGQ63136_SETTINGS_V1";
    const REVIEW_CLICKER_ID_KEY = "DGQ63136_REVIEW_CLICKER_ID_V1";
    const UPDATE_CACHE_KEY = "DGQ63136_UPDATE_CACHE_V1";
    const DEFAULT_TAGS_KEY = "DGQ63136_DEFAULT_TAGS";
    const DEFAULT_TAGS_MIGRATION_KEY = "DGQ63136_DEFAULT_TAGS_MIGRATED_TO_01";
    const DEFAULT_SUBMIT_TAG = "01";
    const FAVORITES_LIMIT = 500;
    const RECENTS_LIMIT = 100;
    const AUTO_UPDATE_CHECK_INTERVAL = 60 * 60 * 1000;
    const CATEGORY_PAGE_SIZE = 5;
    const LIST_PAGE_SIZE = 5;
    const HOTWALL_STREAM_LIMIT = 40;
    const HOTWALL_RANK_LIMIT = 20;
    const BARRAGE_ITEM_SELECTOR = ".Barrage-listItem, [class*='Barrage-listItem']";
    const BARRAGE_LIST_ROOT_SELECTOR = "#js-barrage-list, .Barrage-list, [class*='Barrage-list']";
    const BARRAGE_PANEL_ROOT_SELECTOR = "#comment-dzjy-container, #comment-higher-container, .danmuTips-1ee820";
    const PANEL_ACTION_SELECTOR = "#dgq-panel-submit, #dgq-panel-plus-one";
    const EXTERNAL_PLUGIN_ROOT_SELECTOR = "#xy-gift-recorder, [id^='xy-'], [class^='xy-'], [class*=' xy-']";
    const VIDEO_SYNC_BUTTON_ID = "dgq-video-sync";
    const DOUYUEX_VIDEO_SYNC_BUTTON_ID = "ex-videosync";
    const VIDEO_SYNC_TOOLBAR_SELECTOR = ".left-d3671e, .left-bfab3b";
    const LIVE_VIDEO_SELECTOR = ".layout-Player-videoEntity video, video";
    const PLAYER_GIFT_POPUP_ROOT_SELECTOR = "#js-player-dialog, .layout-Player-main, .layout-Player-video, .layout-Player-videoEntity";
    const PLAYER_GIFT_POPUP_HIDDEN_ATTRIBUTE = "data-dgq-hidden-player-gift-popup";
    const CATEGORY_SORT_OPTIONS = [
        { label: "最新", value: "latest" },
        { label: "最热", value: "hot" },
        { label: "点赞", value: "likes" },
        { label: "复制", value: "copies" }
    ];
    const MODE_TABS = [
        { label: "搜索", value: "search" },
        { label: "分类", value: "category" },
        { label: "热榜", value: "hot" },
        { label: "最近", value: "recents" },
        { label: "收藏", value: "favorites" },
        { label: "设置", value: "settings" }
    ];
    const QUICK_TAG_LABELS = ["喷冬瓜强", "直播间互喷 +1", "QUQU", "亿星大家庭"];
    const SETTINGS_DEFAULTS = {
        confirmBeforeSend: false,
        layoutMode: "standard",
        shortcutsEnabled: true,
        reviewerToken: ""
    };
    const CHANGELOG = {
        "V0.2.25": [
            "优化热榜排序体验。",
            "@呆物麋羊"
        ],
        "V0.2.24": [
            "优化热榜实时显示体验。",
            "@呆物麋羊"
        ],
        "V0.2.18": [
            "优化播放器区域提示显示体验。",
            "@呆物麋羊"
        ],
        "V0.2.17": [
            "新增播放器同步时间入口。",
            "@呆物麋羊"
        ],
        "V0.2.16": [
            "优化弹幕操作入口的稳定性。",
            "@呆物麋羊"
        ],
        "V0.2.15": [
            "优化弹幕操作体验。",
            "@呆物麋羊"
        ],
        "V0.2.14": [
            "优化弹幕操作体验。",
            "@呆物麋羊"
        ],
        "V0.2.13": [
            "优化公开更新说明，改为更简洁的功能概述。",
            "@呆物麋羊"
        ],
        "V0.2.12": [
            "优化弹幕互动操作的响应体验。",
            "@呆物麋羊"
        ],
        "V0.2.11": [
            "完善特殊情况下的弹幕处理流程。",
            "提升相关功能的稳定性和安全性。",
            "@呆物麋羊"
        ],
        "V0.2.10": [
            "优化弹幕识别与交互体验。",
            "@呆物麋羊"
        ],
        "V0.2.9": [
            "优化弹幕操作入口的加载和响应速度。",
            "@呆物麋羊"
        ],
        "V0.2.8": [
            "优化异常提示，提升问题定位体验。",
            "@呆物麋羊"
        ],
        "V0.2.7": [
            "优化插件设置项，减少使用步骤。",
            "@呆物麋羊"
        ],
        "V0.2.6": [
            "完善弹幕管理相关功能，提升整体稳定性。",
            "@呆物麋羊"
        ],
        "V0.2.5": [
            "优化插件设置与使用流程。",
            "@呆物麋羊"
        ],
        "V0.2.4": [
            "完善相关功能接入准备。",
            "@呆物麋羊"
        ],
        "V0.2.3": [
            "优化功能设置，减少使用步骤。",
            "@呆物麋羊"
        ],
        "V0.2.1": [
            "优化版本提示和更新体验。",
            "@呆物麋羊"
        ],
        "V0.2.0": [
            "优化版本显示和更新提示。",
            "@呆物麋羊"
        ],
        "V0.1.9": [
            "优化更新提示窗口，减少对页面操作的影响。",
            "@呆物麋羊"
        ],
        "V0.1.8": [
            "新增版本检测和更新提醒。",
            "优化重复打开面板时的检测体验。",
            "@呆物麋羊"
        ],
        "V0.1.7": [
            "优化直播间启动速度和使用体验。",
            "减少插件平时的资源占用。",
            "@呆物麋羊"
        ],
        "V0.1.6": [
            "优化弹幕互动功能的处理方式。",
            "进一步降低插件运行时的资源占用。",
            "@呆物麋羊"
        ],
        "V0.1.5": [
            "优化弹幕操作入口的加载速度。",
            "降低页面变化较多时的额外开销。",
            "@呆物麋羊"
        ],
        "V0.1.4": [
            "优化弹幕区域的兼容性和显示效果。",
            "减少与页面其他功能的样式影响。",
            "@呆物麋羊"
        ],
        "V0.1.3": [
            "优化弹幕发送内容的识别，避免出现多余文字。",
            "@呆物麋羊"
        ],
        "V0.1.2": [
            "优化弹幕操作入口的显示范围。",
            "减少不相关内容上的干扰。",
            "@呆物麋羊"
        ],
        "V0.1.1": [
            "优化更新按钮和提示窗口体验。",
            "@呆物麋羊"
        ],
        "V0.1.0": [
            "优化热榜、使用统计、布局模式和窄屏显示体验。",
            "完善弹幕互动入口。",
            "@呆物麋羊"
        ],
        "V0.0.9": [
            "浮窗首屏重排：顶部直接显示版本号，搜索 / 分类 / 热榜 / 最近 / 收藏 / 设置入口前置到第一屏。",
            "快捷标签、随机按钮、查看及投稿分类入口更明显，避免看起来仍是旧浮窗。"
        ],
        "V0.0.8": [
            "优化版本兼容和更新提示。",
            "@呆物麋羊"
        ],
        "V0.0.7": [
            "优化版本更新识别。",
            "@呆物麋羊"
        ],
        "V0.0.6": [
            "新增最近使用入口，复制、发送、投稿、收藏都会记录到本地最近。",
            "分类浏览新增最新、最热、点赞、复制排序。",
            "新增随机来一条、快捷标签、收藏分类筛选、发送前确认、快捷键和紧凑模式。",
            "更新提示改为当前版本、最新版本和更新内容卡片。",
            "@呆物麋羊"
        ],
        "V0.0.5": ["分类浏览和热梗列表显示网站返回时间，并统一展示到分钟。"],
        "V0.0.4": ["选择分类后每页 5 条查看该分类弹幕，分类下拉贴屏展开。"],
        "V0.0.3": ["新增 24 小时热门和 7 天热门折叠入口。"],
        "V0.0.2": ["优化分类菜单和弹幕增强体验。"],
        "V0.0.1": ["新增一键投稿、本地收藏和更新提示。"]
    };
    const LEGACY_VERSION_MAP = {
        "2026.08.17.09": "0.2.25",
        "2026.08.17.08": "0.2.24",
        "2026.08.17.04": "0.2.20",
        "2026.08.17.03": "0.2.19",
        "2026.08.17.02": "0.2.18",
        "2026.08.17.01": "0.2.17",
        "2026.08.15.08": "0.2.16",
        "2026.08.15.07": "0.2.15",
        "2026.08.15.06": "0.2.14",
        "2026.08.15.05": "0.2.13",
        "2026.08.15.04": "0.2.12",
        "2026.08.15.03": "0.2.11",
        "2026.08.14.04": "0.2.11",
        "2026.08.14.03": "0.2.10",
        "2026.08.14.02": "0.2.9",
        "2026.08.14.01": "0.2.8",
        "2026.08.13.08": "0.2.7",
        "2026.08.13.07": "0.2.6",
        "2026.08.13.06": "0.2.5",
        "2026.08.13.05": "0.2.4",
        "2026.08.13.04": "0.2.3",
        "2026.08.13.03": "0.2.2",
        "2026.08.13.02": "0.2.1",
        "2026.08.13.01": "0.2.0",
        "2026.08.12.13": "0.1.9",
        "2026.08.12.12": "0.1.8",
        "2026.08.12.11": "0.1.7",
        "2026.08.12.10": "0.1.6",
        "2026.08.12.09": "0.1.5",
        "2026.08.12.08": "0.1.4",
        "2026.08.12.07": "0.1.3",
        "2026.08.12.06": "0.1.2",
        "2026.08.12.05": "0.1.1",
        "2026.08.12.04": "0.1.0",
        "2026.08.12.02": "0.0.9",
        "2026.08.12.01": "0.0.8",
        "2026.08.11.05": "0.0.5",
        "2026.08.11.04": "0.0.4",
        "2026.08.11.03": "0.0.3",
        "2026.08.11.02": "0.0.2",
        "2026.08.11.01": "0.0.1"
    };
    const FALLBACK_TAGS = [
        { label: "直播间互喷 +1", value: "00" },
        { label: "喷冬瓜强", value: "01" },
        { label: "警钟长鸣2022", value: "02" },
        { label: "警钟长鸣2023", value: "03" },
        { label: "警钟长鸣2024", value: "04" },
        { label: "警钟长鸣2025", value: "05" },
        { label: "QUQU", value: "06" },
        { label: "喷超哥", value: "07" },
        { label: "亿星大家庭", value: "08" },
        { label: "警钟长鸣2026", value: "09" }
    ];

    const state = {
        panelVisible: false,
        mode: "search",
        searchInput: null,
        randomButton: null,
        modeTabs: {},
        shortcutTagsWrap: null,
        tagOptions: FALLBACK_TAGS.slice(),
        cooldown: false,
        updateLatestVersion: "",
        updateLatestDisplayVersion: "",
        updateTipEl: null,
        updateCardEl: null,
        updateCardVisible: false,
        favoritesBtn: null,
        table: null,
        tableTitle: null,
        tableTitleText: null,
        tableTitleActions: null,
        hotToggleButton: null,
        hotSection: null,
        hotList: null,
        hotTabs: {},
        hotExpanded: false,
        hotTab: "24h",
        hotLoading: false,
        hotLoadingTab: "",
        hotCache: { "realtime": [], "five": [], "24h": [], "7d": [] },
        hotwallRequest: null,
        tagPickerButton: null,
        tagPickerMenu: null,
        tagPickerOpen: false,
        categoryTag: "",
        categoryPage: 1,
        categoryTotal: 0,
        categorySort: "latest",
        categoryRows: [],
        searchRows: [],
        recentsPage: 1,
        favoritesPage: 1,
        favoriteFilterTag: "all",
        currentRows: [],
        currentPager: null,
        settings: SETTINGS_DEFAULTS,
        panelCreated: false,
        panelBootstrapped: false,
        autoUpdatePromptChecked: false,
        autoUpdateDialogShown: false,
        gfWebSocketStarted: false,
        barrageActionsStarted: false,
        panelActionCaptureStarted: false,
        videoSyncStarted: false,
        playerGiftPopupBlockerStarted: false,
        lastDeepToolbarSearchAt: 0
    };

    console.log("dgq63136.cn插件--当前版本:" + CURRENT_VERSION);

    GM_addStyle(`
        #dgq63136-panel {
            font-size: 14px;
            border-radius: 8px;
            display: none;
            position: fixed;
            width: 460px;
            max-width: calc(100vw - 16px);
            top: 150px;
            right: 8px;
            z-index: 99999;
            background: #f7f8fb;
            border: 1px solid #ddd;
            max-height: 620px;
            box-sizing: border-box;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            color: #111;
        }
        #dgq63136-panel button,
        #dgq63136-panel input {
            font: inherit;
        }
        .dgq-toolbar {
            width: 100%;
            min-height: 54px;
            padding: 8px 10px;
            box-sizing: border-box;
            background: linear-gradient(180deg, #ffffff 0%, #f2f6fb 100%);
            position: relative;
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto auto;
            gap: 8px;
            align-items: center;
            cursor: move;
            flex-shrink: 0;
            user-select: none;
            border-bottom: 1px solid #dbe3ea;
        }
        .dgq-header-left {
            min-width: 0;
            display: grid;
            gap: 3px;
        }
        .dgq-brand-line {
            display: flex;
            align-items: center;
            gap: 7px;
            min-width: 0;
        }
        .dgq-brand-line strong {
            color: #123044;
            font-size: 15px;
            line-height: 18px;
        }
        .dgq-version-badge {
            display: inline-flex;
            align-items: center;
            height: 18px;
            padding: 0 6px;
            border-radius: 4px;
            background: #1976d2;
            color: #fff;
            font-size: 11px;
            font-weight: 700;
            line-height: 18px;
        }
        .dgq-brand-subtitle {
            color: #637083;
            font-size: 11px;
            line-height: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .dgq-header-actions {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .dgq-header-link {
            border: 1px solid #d5dee8;
            border-radius: 4px;
            padding: 3px 6px;
            background: #fff;
            color: #24445c;
            cursor: pointer;
            font-size: 12px;
            line-height: 18px;
            white-space: nowrap;
        }
        .dgq-header-link:hover {
            border-color: #1976d2;
            color: #1976d2;
        }
        .dgq-icon-btn {
            width: 30px;
            height: 36px;
            position: absolute;
            padding: 0;
            background: transparent;
            border: none;
            top: 5px;
            cursor: pointer;
            color: #111;
        }
        .dgq-icon-btn svg {
            display: block;
            margin: 0 auto;
        }
        .dgq-icon-btn span {
            display: block;
            font-size: 11px;
            line-height: 12px;
            color: #111;
            white-space: nowrap;
        }
        .dgq-update-tip {
            font-size: 12px;
            color: #ff5722;
            font-weight: 700;
            display: none;
            cursor: pointer;
            border: 1px solid #ffd6c2;
            border-radius: 4px;
            background: #fff7f2;
            padding: 3px 6px;
            white-space: nowrap;
        }
        .dgq-close-btn {
            width: 26px;
            height: 26px;
            border: 1px solid #d5dee8;
            border-radius: 4px;
            background: #fff;
            color: #637083;
            font-size: 16px;
            line-height: 20px;
            cursor: pointer;
        }
        .dgq-online-count {
            font-size: 11px;
            color: #333;
            padding: 3px 6px;
            background: #e8f5e9;
            border-radius: 4px;
            line-height: 1.4;
            white-space: nowrap;
        }
        .dgq-search-wrap,
        .dgq-settings-wrap {
            padding: 8px;
            background: #fff;
            display: flex;
            gap: 6px;
            align-items: center;
            flex-shrink: 0;
            border-top: 1px solid #eee;
        }
        .dgq-search-wrap input {
            flex: 1;
            min-width: 0;
            padding: 5px 6px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .dgq-settings-wrap label {
            white-space: nowrap;
            color: #333;
            font-size: 12px;
        }
        .dgq-random-btn {
            background: #ff9800;
        }
        .dgq-update-card {
            display: none;
            padding: 8px 10px;
            border-top: 1px solid #f2d6bf;
            border-bottom: 1px solid #f2d6bf;
            background: #fff8f0;
            color: #333;
            font-size: 12px;
            line-height: 1.45;
            flex-shrink: 0;
        }
        .dgq-update-card.is-visible {
            display: block;
        }
        .dgq-update-card strong {
            color: #d35400;
        }
        .dgq-update-card ul {
            margin: 5px 0;
            padding-left: 18px;
        }
        .dgq-update-card button {
            border: 0;
            border-radius: 4px;
            padding: 4px 8px;
            background: #ff9800;
            color: #fff;
            cursor: pointer;
        }
        #dgq-update-dialog-mask {
            position: fixed;
            right: 16px;
            bottom: 82px;
            z-index: 100004;
            background: transparent;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            padding: 0;
            box-sizing: border-box;
            pointer-events: none;
        }
        .dgq-update-dialog {
            width: 360px;
            max-width: 100%;
            border-radius: 8px;
            background: #fff;
            color: #222;
            box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);
            overflow: hidden;
            pointer-events: auto;
        }
        .dgq-update-dialog-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 11px 12px;
            border-bottom: 1px solid #edf0f2;
            background: #f7fbff;
        }
        .dgq-update-dialog-header strong {
            font-size: 15px;
            color: #123044;
        }
        .dgq-update-dialog-close {
            width: 26px;
            height: 26px;
            border: 1px solid #d5dee8;
            border-radius: 4px;
            background: #fff;
            color: #637083;
            cursor: pointer;
        }
        .dgq-update-dialog-body {
            padding: 12px;
            font-size: 13px;
            line-height: 1.55;
        }
        .dgq-update-dialog-status {
            margin-bottom: 8px;
            font-weight: 700;
            color: #1976d2;
        }
        .dgq-update-dialog-versions {
            color: #555;
        }
        .dgq-update-dialog-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            padding: 10px 12px 12px;
            border-top: 1px solid #edf0f2;
        }
        .dgq-update-dialog-actions button {
            border: 0;
            border-radius: 4px;
            padding: 6px 12px;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
        }
        .dgq-update-dialog-update {
            background: #1976d2;
        }
        .dgq-update-dialog-visit {
            background: #4caf50;
        }
        .dgq-update-dialog-actions button:disabled {
            background: #b7c1cc;
            cursor: not-allowed;
        }
        .dgq-shortcut-tags {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 5px;
            padding: 6px 8px;
            border-top: 1px solid #eee;
            background: #fbfdff;
            flex-shrink: 0;
            overflow: visible;
        }
        .dgq-shortcut-tags::before {
            content: "快捷";
            color: #667085;
            font-size: 12px;
            line-height: 18px;
            white-space: nowrap;
        }
        .dgq-shortcut-tag {
            border: 1px solid #c7e2cc;
            border-radius: 4px;
            padding: 3px 7px;
            background: #f4fff6;
            color: #25632e;
            cursor: pointer;
            font-size: 12px;
            line-height: 18px;
            white-space: nowrap;
        }
        .dgq-shortcut-tag.is-more {
            border-color: #d0d7de;
            background: #f6f8fa;
            color: #333;
        }
        .dgq-mode-tabs {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 4px;
            padding: 7px 8px;
            background: #edf3f8;
            border-bottom: 1px solid #dbe3ea;
            flex-shrink: 0;
        }
        .dgq-mode-tab {
            border: 1px solid #d4dde6;
            border-radius: 4px;
            padding: 5px 3px;
            background: #fff;
            color: #333;
            cursor: pointer;
            font-size: 12px;
            line-height: 18px;
            white-space: nowrap;
        }
        .dgq-mode-tab.is-active {
            background: #1976d2;
            color: #fff;
            font-weight: 700;
        }
        .dgq-tag-picker {
            flex: 1;
            min-width: 150px;
            position: relative;
        }
        .dgq-tag-picker-button {
            width: 100%;
            min-height: 30px;
            padding: 4px 24px 4px 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: #fff;
            color: #111;
            cursor: pointer;
            text-align: left;
            position: relative;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .dgq-tag-picker-button::after {
            content: "v";
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            color: #555;
            font-size: 11px;
        }
        .dgq-tag-picker-menu {
            position: fixed;
            left: 0;
            top: 0;
            z-index: 100002;
            width: 180px;
            min-width: 150px;
            max-height: 240px;
            overflow-y: auto;
            border: 1px solid #cfcfcf;
            border-radius: 4px;
            background: #fff;
            box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
        }
        .dgq-tag-picker-menu[hidden] {
            display: none;
        }
        .dgq-tag-picker-option {
            display: block;
            width: 100%;
            border: 0;
            border-bottom: 1px solid #eee;
            padding: 7px 8px;
            background: #fff;
            color: #111;
            cursor: pointer;
            text-align: left;
            line-height: 1.25;
        }
        .dgq-tag-picker-option:hover,
        .dgq-tag-picker-option.is-selected {
            background: #e8f5e9;
            color: #1b5e20;
        }
        .dgq-tag-picker-option.is-selected {
            font-weight: 700;
        }
        .dgq-primary-btn,
        .dgq-secondary-btn,
        .dgq-danger-btn {
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            color: #fff;
            cursor: pointer;
            white-space: nowrap;
        }
        .dgq-primary-btn {
            background: #4caf50;
        }
        .dgq-secondary-btn {
            background: #607d8b;
        }
        .dgq-danger-btn {
            background: #d9534f;
        }
        .dgq-table-title {
            padding: 6px 8px;
            font-size: 12px;
            color: #555;
            background: #fff;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 8px;
        }
        .dgq-table-title-text {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .dgq-table-title-actions {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            flex-wrap: wrap;
            flex-shrink: 0;
            max-width: 100%;
        }
        .dgq-sort-btn,
        .dgq-filter-btn,
        .dgq-hot-tab,
        .dgq-hot-refresh {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 3px 7px;
            background: #fff;
            color: #333;
            cursor: pointer;
            font-size: 12px;
            line-height: 18px;
            white-space: nowrap;
        }
        .dgq-sort-btn.is-active,
        .dgq-filter-btn.is-active {
            border-color: #1976d2;
            background: #1976d2;
            color: #fff;
            font-weight: 700;
        }
        .dgq-hot-toggle {
            min-width: 72px;
            border: 1px solid #ff6b6b;
            border-radius: 4px;
            padding: 2px 8px;
            background: #fff5f5;
            color: #d43c3c;
            cursor: pointer;
            font-size: 12px;
            line-height: 18px;
            white-space: nowrap;
            flex-shrink: 0;
        }
        .dgq-hot-toggle:hover {
            background: #ffe9e9;
        }
        .dgq-hot-section {
            padding: 6px 8px 8px;
            border-bottom: 1px solid #eee;
            background: #fffdf7;
            flex-shrink: 0;
        }
        .dgq-hot-section[hidden] {
            display: none;
        }
        .dgq-hot-tabs {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 6px;
        }
        .dgq-hot-tab.is-active {
            border-color: #ff9800;
            background: #ff9800;
            color: #fff;
            font-weight: 700;
        }
        .dgq-hot-refresh {
            margin-left: auto;
            color: #1976d2;
        }
        .dgq-hot-list {
            display: grid;
            gap: 5px;
            max-height: 145px;
            overflow-y: auto;
        }
        .dgq-hot-item {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 6px;
            align-items: center;
            padding: 5px 6px;
            border: 1px solid #f0e2c7;
            border-radius: 6px;
            background: #fff;
        }
        .dgq-hot-main {
            min-width: 0;
        }
        .dgq-hot-content {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            color: #222;
            font-size: 12px;
        }
        .dgq-hot-content:hover {
            color: #d35400;
        }
        .dgq-hot-actions {
            display: inline-flex;
            gap: 3px;
            flex-shrink: 0;
        }
        .dgq-hot-empty {
            padding: 8px 6px;
            color: #777;
            font-size: 12px;
            text-align: center;
        }
        .dgq-scroll-box {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            background: #fff;
        }
        .dgq-table {
            width: 100%;
            border-collapse: collapse;
        }
        .dgq-table tr:nth-child(even) {
            background: #f9f9f9;
        }
        .dgq-table td {
            padding: 8px;
            color: #111;
            border-bottom: 1px solid #eee;
            vertical-align: top;
        }
        .dgq-content-cell {
            cursor: pointer;
            word-break: break-all;
            line-height: 1.35;
        }
        .dgq-content-text {
            color: #111;
        }
        .dgq-row-meta,
        .dgq-hot-meta {
            margin-top: 3px;
            color: #777;
            font-size: 11px;
            line-height: 1.35;
        }
        .dgq-row-meta-line {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .dgq-actions-cell {
            width: 132px;
            text-align: center;
        }
        .dgq-actions {
            display: inline-flex;
            gap: 4px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .dgq-mini-btn {
            border: none;
            border-radius: 4px;
            padding: 2px 6px;
            color: #fff;
            cursor: pointer;
            font-size: 12px;
            line-height: 18px;
        }
        .dgq-send {
            background: #ff5722;
        }
        .dgq-submit {
            background: #1976d2;
        }
        .dgq-favorite {
            background: #8e44ad;
        }
        .dgq-review {
            background: #0f766e;
        }
        .dgq-remove {
            background: #d9534f;
        }
        .dgq-category-pager-cell {
            padding: 6px 8px !important;
            background: #f7fbff;
        }
        .dgq-category-pager {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: #333;
            font-size: 12px;
        }
        .dgq-category-page-info {
            min-width: 64px;
            text-align: center;
            white-space: nowrap;
        }
        .dgq-category-page-btn {
            border: 1px solid #b7d7f0;
            border-radius: 4px;
            padding: 3px 8px;
            background: #fff;
            color: #1976d2;
            cursor: pointer;
            font-size: 12px;
            line-height: 18px;
        }
        .dgq-category-page-btn:disabled {
            color: #aaa;
            border-color: #ddd;
            cursor: not-allowed;
        }
        .dgq-settings-panel {
            padding: 10px 8px;
            display: grid;
            gap: 8px;
            color: #222;
            font-size: 13px;
        }
        .dgq-setting-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding: 7px 8px;
            border: 1px solid #eee;
            border-radius: 6px;
            background: #fafafa;
        }
        .dgq-setting-row label {
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
        }
        .dgq-layout-toggle {
            display: inline-flex;
            gap: 4px;
            padding: 2px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #fff;
        }
        .dgq-layout-choice {
            min-width: 48px;
            border: none;
            border-radius: 3px;
            padding: 4px 8px;
            background: transparent;
            color: #333;
            cursor: pointer;
            font-size: 12px;
            line-height: 18px;
        }
        .dgq-layout-choice.is-active {
            background: #1976d2;
            color: #fff;
            font-weight: 700;
        }
        .dgq-shortcut-help {
            padding: 7px 8px;
            border-radius: 6px;
            background: #f3f7ff;
            color: #40526b;
            line-height: 1.5;
        }
        #dgq63136-panel.dgq-layout-compact {
            width: 390px;
            max-height: 500px;
            font-size: 13px;
        }
        #dgq63136-panel.dgq-layout-compact .dgq-table td {
            padding: 5px 6px;
        }
        #dgq63136-panel.dgq-layout-compact .dgq-row-meta,
        #dgq63136-panel.dgq-layout-compact .dgq-hot-meta {
            font-size: 10px;
            line-height: 1.25;
        }
        #dgq63136-panel.dgq-layout-compact .dgq-mini-btn {
            padding: 1px 5px;
        }
        #meme-btn-id-dgq {
            font-size: 14px;
            padding: 2px 5px;
            margin-right: 5px;
            background: #ff00ff;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #dgq-video-sync {
            float: left;
            width: 24px;
            height: 24px;
            margin-left: 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            cursor: pointer;
            color: #fff;
            background: transparent;
            border: 0;
            padding: 0;
            outline: 0;
            line-height: 1;
        }
        #dgq-video-sync.dgq-video-sync-compact {
            margin-left: 8px;
        }
        #dgq-video-sync svg {
            width: 22px;
            height: 22px;
            display: block;
            pointer-events: none;
        }
        #dgq-video-sync:hover {
            opacity: 0.85;
        }
        [data-dgq-hidden-player-gift-popup="1"] {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }
        .dgq-toast {
            font-size: 16px;
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: #64ce83;
            color: #fff;
            padding: 8px 16px;
            border-radius: 4px;
            z-index: 100000;
            opacity: 1;
            transition: opacity 1s ease;
            max-width: 70vw;
            word-break: break-word;
            pointer-events: none;
        }
        .dgq-toast.dgq-toast-error {
            background: #d9534f;
        }
        .dgq-toast.dgq-toast-warn {
            background: #ff9800;
        }
        .dgq-barrage-enhanced .dgq-barrage-actions {
            display: none;
            margin-left: 6px;
            gap: 4px;
            vertical-align: middle;
        }
        .dgq-barrage-enhanced:hover .dgq-barrage-actions {
            display: inline-flex;
        }
        .dgq-barrage-action-btn {
            border: 0;
            border-radius: 4px;
            padding: 1px 5px;
            font-size: 12px;
            line-height: 18px;
            cursor: pointer;
            color: #fff;
        }
        .dgq-barrage-action-submit {
            background: #1976d2;
        }
        .dgq-barrage-action-plus {
            background: #ff5722;
        }
        .dgq-barrage-action-review {
            background: #0f766e;
        }
        .dgq-barrage-action-favorite {
            background: #8e44ad;
        }
        .dgq-panel-tip-review {
            cursor: pointer !important;
            font-weight: 700 !important;
            min-width: 18px !important;
            padding-left: 3px !important;
            padding-right: 3px !important;
            pointer-events: auto !important;
            position: relative !important;
            z-index: 2147483647 !important;
        }
        .dgq-panel-tip-review:hover {
            color: #ffdd57 !important;
        }
        .dgq-review-setting {
            display: grid;
            gap: 7px;
            padding: 8px;
            border: 1px solid #d8eee9;
            border-radius: 6px;
            background: #f7fffd;
        }
        .dgq-review-setting label {
            display: grid;
            gap: 4px;
            color: #24445c;
            font-size: 12px;
        }
        .dgq-review-setting input {
            width: 100%;
            box-sizing: border-box;
            border: 1px solid #c8d8d4;
            border-radius: 4px;
            padding: 5px 6px;
            color: #111;
            background: #fff;
        }
        .dgq-review-setting-actions {
            display: flex;
            justify-content: flex-end;
            gap: 6px;
        }
        .dgq-review-setting-actions button {
            border: 0;
            border-radius: 4px;
            padding: 5px 9px;
            color: #fff;
            background: #0f766e;
            cursor: pointer;
        }
        .dgq-review-setting-hint {
            color: #607d8b;
            font-size: 12px;
            line-height: 1.45;
        }
        .dgq-submit-dialog-mask {
            position: fixed;
            inset: 0;
            z-index: 100001;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.42);
        }
        .dgq-submit-dialog {
            width: min(380px, calc(100vw - 28px));
            max-height: min(520px, calc(100vh - 40px));
            border-radius: 8px;
            background: #fff;
            color: #111;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            font-size: 14px;
        }
        .dgq-submit-dialog-header {
            padding: 12px 14px;
            font-weight: 700;
            border-bottom: 1px solid #eee;
        }
        .dgq-submit-dialog-preview {
            margin: 12px 14px 0;
            padding: 8px;
            border-radius: 6px;
            background: #f6f7f8;
            color: #333;
            line-height: 1.35;
            max-height: 72px;
            overflow: auto;
            word-break: break-all;
        }
        .dgq-submit-dialog-tags {
            padding: 10px 14px;
            overflow: auto;
            display: grid;
            gap: 6px;
        }
        .dgq-submit-dialog-tag {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 7px 8px;
            border: 1px solid #e6e6e6;
            border-radius: 6px;
            cursor: pointer;
            user-select: none;
        }
        .dgq-submit-dialog-tag input {
            margin: 0;
        }
        .dgq-submit-dialog-actions {
            padding: 10px 14px 14px;
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            border-top: 1px solid #eee;
        }
        .dgq-submit-dialog-actions button {
            border: 0;
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
        }
        .dgq-submit-cancel {
            background: #e9ecef;
            color: #222;
        }
        .dgq-submit-confirm {
            background: #1976d2;
            color: #fff;
        }
        .dgq-panel-tip-submit {
            cursor: pointer !important;
            font-weight: 700 !important;
            min-width: 18px !important;
            padding-left: 3px !important;
            padding-right: 3px !important;
            pointer-events: auto !important;
            position: relative !important;
            z-index: 2147483647 !important;
        }
        .dgq-panel-tip-submit:hover {
            color: #ffdd57 !important;
        }
        .dgq-panel-plus-one {
            cursor: pointer !important;
            font-weight: 700 !important;
            pointer-events: auto !important;
            position: relative !important;
            z-index: 2147483647 !important;
        }
        .dgq-panel-plus-one:hover {
            color: #ffdd57 !important;
        }
    `);

    function storageGet(key, fallbackValue) {
        try {
            if (typeof GM_getValue === "function") {
                return GM_getValue(key, fallbackValue);
            }
        } catch (error) {
            console.warn("[dgq63136] GM_getValue失败", error);
        }
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? fallbackValue : JSON.parse(raw);
        } catch (error) {
            return fallbackValue;
        }
    }

    function storageSet(key, value) {
        try {
            if (typeof GM_setValue === "function") {
                GM_setValue(key, value);
                return;
            }
        } catch (error) {
            console.warn("[dgq63136] GM_setValue失败", error);
        }
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn("[dgq63136] localStorage写入失败", error);
        }
    }

    function createElement(tag, styles = {}, textContent = "") {
        const element = document.createElement(tag);
        Object.assign(element.style, styles);
        if (textContent) element.textContent = textContent;
        return element;
    }

    function querySelectorDeep(selector, root = document) {
        const found = root.querySelector(selector);
        if (found) return found;
        const all = root.querySelectorAll("*");
        for (const element of all) {
            if (element.shadowRoot) {
                const shadowFound = querySelectorDeep(selector, element.shadowRoot);
                if (shadowFound) return shadowFound;
            }
        }
        return null;
    }

    function isExternalPluginNode(node) {
        if (!node || typeof node.closest !== "function") return false;
        return Boolean(node.closest(EXTERNAL_PLUGIN_ROOT_SELECTOR));
    }

    function normalizeUrl(url) {
        let normalized = String(url || "").trim();
        while (/^https?:\/\/https?:\/\//i.test(normalized)) {
            normalized = normalized.replace(/^https?:\/\/(https?:\/\/)/i, "$1");
        }
        return normalized;
    }

    function openExternalUrl(url) {
        const normalized = normalizeUrl(url);
        if (!normalized) return;
        if (typeof GM_openInTab === "function") {
            GM_openInTab(normalized, { active: true, insert: true });
            return;
        }
        window.open(normalized, "_blank", "noopener,noreferrer");
    }

    function randomString(length = 10) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let text = "";
        for (let index = 0; index < length; index += 1) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return text;
    }

    function getOrCreateSiteToken() {
        let token = storageGet(SITE_TOKEN_KEY, "");
        if (typeof token !== "string" || token.length < 6) {
            token = randomString(10);
            storageSet(SITE_TOKEN_KEY, token);
        }
        return token;
    }

    function getOrCreateReviewClickerId() {
        let id = storageGet(REVIEW_CLICKER_ID_KEY, "");
        if (typeof id !== "string" || id.length < 12) {
            id = `dgq-${Date.now().toString(36)}-${randomString(12)}`;
            storageSet(REVIEW_CLICKER_ID_KEY, id);
        }
        return id;
    }

    function parseJsonSafe(text, fallback = null) {
        if (typeof text !== "string") return fallback;
        try {
            return JSON.parse(text);
        } catch (error) {
            return fallback;
        }
    }

    function buildQueryPath(path, params = {}) {
        const query = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value === undefined || value === null || value === "") continue;
            query.set(key, String(value));
        }
        const queryString = query.toString();
        return queryString ? `${path}?${queryString}` : path;
    }

    function apiRequest(method, path, body) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url: API_BASE_URL + path,
                headers: {
                    "Content-Type": "application/json",
                    "dpahjdoiaw": API_AUTH_HEADER,
                    "siteToken": getOrCreateSiteToken()
                },
                data: body === undefined ? undefined : JSON.stringify(body),
                responseType: "json",
                timeout: 20000,
                onload(response) {
                    const payload = response.response || parseJsonSafe(response.responseText, {});
                    if (response.status >= 200 && response.status < 300) {
                        resolve(payload);
                        return;
                    }
                    reject(new Error(`HTTP ${response.status}: ${payload?.msg || response.responseText || "请求失败"}`));
                },
                onerror(error) {
                    reject(error);
                },
                ontimeout() {
                    reject(new Error("请求超时"));
                }
            });
        });
    }

    function externalJsonRequest(method, url, body, headers = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                headers: {
                    "Content-Type": "application/json",
                    ...headers
                },
                data: body === undefined ? undefined : JSON.stringify(body),
                responseType: "json",
                timeout: 12000,
                onload(response) {
                    const payload = response.response || parseJsonSafe(response.responseText, {});
                    if (response.status >= 200 && response.status < 300) {
                        resolve(payload);
                        return;
                    }
                    const message = payload?.reason || payload?.message || payload?.msg || response.responseText || "请求失败";
                    const error = new Error(`HTTP ${response.status}: ${message}`);
                    error.status = response.status;
                    error.payload = payload;
                    reject(error);
                },
                onerror(error) {
                    reject(error);
                },
                ontimeout() {
                    reject(new Error("请求超时"));
                }
            });
        });
    }

    function normalizeBarrageText(text) {
        return String(text || "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function formatDisplayTimeToMinute(value) {
        const raw = String(value || "").trim();
        if (!raw) return "";
        const direct = raw.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
        if (direct) {
            return `${direct[1]}-${direct[2]}-${direct[3]} ${direct[4]}:${direct[5]}`;
        }

        const date = new Date(raw);
        if (Number.isNaN(date.getTime())) return raw;
        const pad = number => String(number).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function getDefaultTags() {
        const stored = storageGet(DEFAULT_TAGS_KEY, null);
        const tags = Array.isArray(stored) ? stored : String(stored || "").split(",");
        let cleaned = tags.map(tag => String(tag || "").trim()).filter(Boolean).slice(0, 5);
        const migrated = Boolean(storageGet(DEFAULT_TAGS_MIGRATION_KEY, false));
        if (!migrated) {
            if (cleaned.length === 0 || (cleaned.length === 1 && cleaned[0] === "00")) {
                cleaned = [DEFAULT_SUBMIT_TAG];
                storageSet(DEFAULT_TAGS_KEY, cleaned);
            }
            storageSet(DEFAULT_TAGS_MIGRATION_KEY, true);
        }
        return cleaned.length > 0 ? cleaned : [DEFAULT_SUBMIT_TAG];
    }

    function setDefaultTags(tags) {
        const cleaned = tags.map(tag => String(tag || "").trim()).filter(Boolean).slice(0, 5);
        storageSet(DEFAULT_TAGS_KEY, cleaned.length > 0 ? cleaned : [DEFAULT_SUBMIT_TAG]);
    }

    function getTagLabel(tagValue) {
        const option = state.tagOptions.find(item => item.value === tagValue);
        return option ? option.label : tagValue;
    }

    function mergeTagOptions(remoteOptions) {
        const merged = [];
        const seen = new Set();
        for (const option of remoteOptions.concat(FALLBACK_TAGS)) {
            const label = String(option?.label || "").trim();
            const value = String(option?.value || "").trim();
            if (!label || !value || seen.has(value)) continue;
            merged.push({ label, value });
            seen.add(value);
        }
        return merged.length > 0 ? merged : FALLBACK_TAGS.slice();
    }

    async function loadTagOptions() {
        try {
            const response = await apiRequest("GET", API_PATHS.DICT_LIST);
            if (response?.code === 200 && Array.isArray(response.data)) {
                const remoteOptions = response.data.map(item => ({
                    label: item.dictLabel,
                    value: item.dictValue
                })).filter(item => item.label && item.value);
                state.tagOptions = mergeTagOptions(remoteOptions);
            }
        } catch (error) {
            console.warn("[dgq63136] 获取投稿标签失败，使用内置标签", error);
        }
        renderTagSelect();
        renderShortcutTags();
    }

    function getSettings() {
        const stored = storageGet(SETTINGS_KEY, {});
        const settings = { ...SETTINGS_DEFAULTS, ...(stored && typeof stored === "object" ? stored : {}) };
        if (!["standard", "compact"].includes(settings.layoutMode)) settings.layoutMode = SETTINGS_DEFAULTS.layoutMode;
        settings.confirmBeforeSend = Boolean(settings.confirmBeforeSend);
        settings.shortcutsEnabled = settings.shortcutsEnabled !== false;
        delete settings.reviewEndpoint;
        delete settings.reviewToken;
        delete settings.reviewerName;
        settings.reviewerToken = String(settings.reviewerToken || "").trim();
        return settings;
    }

    function purgeLegacyReviewSecrets() {
        const stored = storageGet(SETTINGS_KEY, {});
        if (!stored || typeof stored !== "object") return;
        if (!("reviewEndpoint" in stored) && !("reviewToken" in stored) && !("reviewerName" in stored)) return;
        const cleaned = { ...stored };
        delete cleaned.reviewEndpoint;
        delete cleaned.reviewToken;
        delete cleaned.reviewerName;
        storageSet(SETTINGS_KEY, cleaned);
    }

    function saveSettings(patch = {}) {
        const nextSettings = { ...getSettings(), ...patch };
        delete nextSettings.reviewEndpoint;
        delete nextSettings.reviewToken;
        delete nextSettings.reviewerName;
        nextSettings.reviewerToken = String(nextSettings.reviewerToken || "").trim();
        state.settings = nextSettings;
        storageSet(SETTINGS_KEY, state.settings);
        applyLayoutMode();
        renderModeTabs();
        if (state.mode === "settings") renderSettings();
    }

    function applyLayoutMode() {
        const panel = document.getElementById("dgq63136-panel");
        if (!panel) return;
        panel.classList.toggle("dgq-layout-compact", getSettings().layoutMode === "compact");
    }

    function parseTags(value) {
        if (Array.isArray(value)) {
            return value.map(item => String(item || "").trim()).filter(Boolean);
        }
        return String(value || "")
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);
    }

    function getTagLabels(tags) {
        const values = parseTags(tags);
        return values.length ? values.map(getTagLabel) : ["未分类"];
    }

    function getPrimaryTime(item = {}) {
        return item.hotDateTime || item.submitTime || item.createTime || item.updateTime || item.time || item.createdAt || "";
    }

    function normalizeMemeRow(item = {}, defaults = {}) {
        const tags = parseTags(item.tags || item.tag || defaults.tags || defaults.tag || "");
        const rawTime = getPrimaryTime(item) || defaults.time || "";
        return {
            id: String(item.id || item.barrageId || item.memeId || defaults.memeId || ""),
            content: normalizeBarrageText(item.barrage || item.content || ""),
            displayTime: formatDisplayTimeToMinute(rawTime),
            tags,
            copyCount: Number(item.cnt ?? item.copyCount ?? defaults.copyCount ?? 0) || 0,
            likes: Number(item.likes ?? defaults.likes ?? 0) || 0,
            action: item.action || defaults.action || "",
            usedAt: item.usedAt || defaults.usedAt || "",
            meta: {
                source: defaults.source || item.source || "search",
                tags,
                memeId: String(item.id || item.barrageId || item.memeId || defaults.memeId || ""),
                copyCount: Number(item.cnt ?? item.copyCount ?? defaults.copyCount ?? 0) || 0,
                likes: Number(item.likes ?? defaults.likes ?? 0) || 0,
                time: rawTime
            }
        };
    }

    function normalizeStoredFavorite(item = {}) {
        const row = normalizeMemeRow({
            ...item,
            barrage: item.content,
            copyCount: item.copyCount,
            time: item.time || item.createdAt
        }, { source: item.source || "favorite" });
        return {
            ...item,
            id: item.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            content: row.content,
            tags: row.tags,
            memeId: row.meta.memeId,
            copyCount: row.copyCount,
            likes: row.likes,
            time: row.meta.time,
            displayTime: row.displayTime
        };
    }

    function getRecents() {
        const recents = storageGet(RECENTS_KEY, []);
        return Array.isArray(recents)
            ? recents.map(item => normalizeMemeRow(item, { source: item.source || "recent", action: item.action })).filter(item => item.content)
            : [];
    }

    function saveRecents(recents) {
        storageSet(RECENTS_KEY, recents.slice(0, RECENTS_LIMIT));
    }

    function addRecentUsage(text, meta = {}) {
        const row = normalizeMemeRow({
            barrage: text,
            tags: meta.tags,
            memeId: meta.memeId,
            copyCount: meta.copyCount,
            likes: meta.likes,
            time: meta.time
        }, meta);
        if (!row.content) return;
        const usedAt = new Date().toISOString();
        const recents = getRecents();
        const existedIndex = recents.findIndex(item =>
            (row.meta.memeId && item.meta.memeId === row.meta.memeId) || item.content === row.content
        );
        if (existedIndex >= 0) recents.splice(existedIndex, 1);
        recents.unshift({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            content: row.content,
            action: meta.action || "copy",
            source: meta.source || "search",
            tags: row.tags,
            memeId: row.meta.memeId,
            copyCount: row.copyCount,
            likes: row.likes,
            time: row.meta.time,
            usedAt
        });
        saveRecents(recents);
        if (state.mode === "recents") renderRecents(1);
    }

    function getFavorites() {
        const favorites = storageGet(FAVORITES_KEY, []);
        return Array.isArray(favorites)
            ? favorites.map(normalizeStoredFavorite).filter(item => item.content)
            : [];
    }

    function saveFavorites(favorites) {
        storageSet(FAVORITES_KEY, favorites.slice(0, FAVORITES_LIMIT));
        updateFavoritesCount();
    }

    function addFavorite(text, meta = {}) {
        const content = normalizeBarrageText(text);
        if (!content) {
            showMsg("没有可收藏的弹幕", "warn");
            return false;
        }
        const normalized = normalizeMemeRow({ barrage: content }, meta);
        const favorites = getFavorites();
        const existedIndex = favorites.findIndex(item => item.content === content);
        if (existedIndex >= 0) {
            const [existed] = favorites.splice(existedIndex, 1);
            favorites.unshift({
                ...existed,
                tags: normalized.tags.length ? normalized.tags : existed.tags,
                memeId: normalized.meta.memeId || existed.memeId,
                copyCount: normalized.copyCount || existed.copyCount || 0,
                likes: normalized.likes || existed.likes || 0,
                time: normalized.meta.time || existed.time || "",
                updatedAt: new Date().toISOString()
            });
            saveFavorites(favorites);
            addRecentUsage(content, { ...normalized.meta, action: "favorite" });
            showMsg("这条弹幕已在本地收藏，已移到最上方");
            if (state.mode === "favorites") renderFavorites();
            return true;
        }
        favorites.unshift({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            content,
            source: meta.source || "douyu",
            author: meta.author || "",
            roomId: getRoomId(),
            tags: normalized.tags,
            memeId: normalized.meta.memeId,
            copyCount: normalized.copyCount,
            likes: normalized.likes,
            time: normalized.meta.time,
            createdAt: new Date().toISOString()
        });
        saveFavorites(favorites);
        addRecentUsage(content, { ...normalized.meta, action: "favorite" });
        showMsg("已收藏到插件本地收藏");
        if (state.mode === "favorites") renderFavorites();
        return true;
    }

    function removeFavorite(id) {
        saveFavorites(getFavorites().filter(item => item.id !== id));
        renderFavorites();
        showMsg("已从本地收藏删除");
    }

    function updateFavoritesCount() {
        if (state.favoritesBtn) {
            state.favoritesBtn.textContent = `收藏夹(${getFavorites().length})`;
        }
        renderModeTabs();
    }

    async function submitMeme(text, tags = getDefaultTags(), meta = {}) {
        text = normalizeBarrageText(text);
        tags = Array.isArray(tags) ? tags : [String(tags || DEFAULT_SUBMIT_TAG)];
        tags = tags.map(tag => String(tag || "").trim()).filter(Boolean).slice(0, 5);
        if (!text) {
            showMsg("没有可投稿的弹幕", "warn");
            return false;
        }
        if (text.length > 255) {
            showMsg("弹幕超过255字，63136投稿接口可能不收，请先缩短", "warn");
            return false;
        }
        if (tags.length === 0) {
            tags = [DEFAULT_SUBMIT_TAG];
        }

        try {
            const response = await apiRequest("POST", API_PATHS.SUBMIT_MEME, {
                tags: tags.join(","),
                barrage: text
            });
            if (response?.code === 200) {
                addRecentUsage(text, { ...meta, tags, action: "submit" });
                showMsg(`投稿成功，分类：${tags.map(getTagLabel).join("、")}，待审核`);
                return true;
            }
            if (response?.code === 500) {
                showMsg("烂梗已经有了，勿重复提交", "warn");
                return false;
            }
            showMsg(response?.msg || "投稿失败", "error");
            return false;
        } catch (error) {
            console.error("[dgq63136] 投稿失败", error);
            showMsg("投稿失败，请稍后再试", "error");
            return false;
        }
    }

    function openSubmitTagDialog(text, meta = {}) {
        text = normalizeBarrageText(text);
        if (!text) {
            showMsg("没有可投稿的弹幕", "warn");
            return;
        }
        if (text.length > 255) {
            showMsg("弹幕超过255字，63136投稿接口可能不收，请先缩短", "warn");
            return;
        }

        document.getElementById("dgq-submit-dialog-mask")?.remove();

        const tagOptions = state.tagOptions.length > 0 ? state.tagOptions : FALLBACK_TAGS;
        const defaultSelected = new Set(getDefaultTags());
        if (defaultSelected.size === 0) defaultSelected.add(DEFAULT_SUBMIT_TAG);

        const mask = document.createElement("div");
        mask.id = "dgq-submit-dialog-mask";
        mask.className = "dgq-submit-dialog-mask";

        const dialog = document.createElement("div");
        dialog.className = "dgq-submit-dialog";
        mask.appendChild(dialog);

        const header = document.createElement("div");
        header.className = "dgq-submit-dialog-header";
        header.textContent = "选择投稿标签";
        dialog.appendChild(header);

        const preview = document.createElement("div");
        preview.className = "dgq-submit-dialog-preview";
        preview.textContent = text;
        dialog.appendChild(preview);

        const tagsWrap = document.createElement("div");
        tagsWrap.className = "dgq-submit-dialog-tags";
        dialog.appendChild(tagsWrap);

        for (const tag of tagOptions) {
            const label = document.createElement("label");
            label.className = "dgq-submit-dialog-tag";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = tag.value;
            checkbox.checked = defaultSelected.has(tag.value);
            checkbox.addEventListener("change", () => {
                const checked = tagsWrap.querySelectorAll("input:checked");
                if (checked.length > 5) {
                    checkbox.checked = false;
                    showMsg("最多选择5个投稿标签", "warn");
                }
            });

            const span = document.createElement("span");
            span.textContent = tag.label;

            label.appendChild(checkbox);
            label.appendChild(span);
            tagsWrap.appendChild(label);
        }

        if (!tagsWrap.querySelector("input:checked")) {
            const firstDefault = tagsWrap.querySelector(`input[value="${DEFAULT_SUBMIT_TAG}"]`) || tagsWrap.querySelector("input");
            if (firstDefault) firstDefault.checked = true;
        }

        const actions = document.createElement("div");
        actions.className = "dgq-submit-dialog-actions";
        dialog.appendChild(actions);

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.className = "dgq-submit-cancel";
        cancelButton.textContent = "取消";
        actions.appendChild(cancelButton);

        const confirmButton = document.createElement("button");
        confirmButton.type = "button";
        confirmButton.className = "dgq-submit-confirm";
        confirmButton.textContent = "投稿";
        actions.appendChild(confirmButton);

        const close = () => mask.remove();
        cancelButton.addEventListener("click", close);
        mask.addEventListener("click", event => {
            if (event.target === mask) close();
        });
        dialog.addEventListener("click", event => event.stopPropagation());
        confirmButton.addEventListener("click", async () => {
            const tags = Array.from(tagsWrap.querySelectorAll("input:checked")).map(input => input.value);
            if (tags.length === 0) {
                showMsg("请选择至少1个投稿标签", "warn");
                return;
            }
            confirmButton.disabled = true;
            confirmButton.textContent = "投稿中...";
            const ok = await submitMeme(text, tags, meta);
            if (ok) {
                close();
                return;
            }
            confirmButton.disabled = false;
            confirmButton.textContent = "投稿";
        });

        document.body.appendChild(mask);
    }

    function copyText(text, meta = {}) {
        const content = normalizeBarrageText(text);
        if (!content) return;
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(content)
                .then(() => {
                    addRecentUsage(content, { ...meta, action: "copy" });
                    reportMemeUsage(meta);
                    showMsg("已复制");
                })
                .catch(() => fallbackCopy(content, meta));
            return;
        }
        fallbackCopy(content, meta);
    }

    function fallbackCopy(text, meta = {}) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            addRecentUsage(text, { ...meta, action: "copy" });
            reportMemeUsage(meta);
            showMsg("已复制");
        } catch (error) {
            showMsg("复制失败，请手动复制", "error");
        } finally {
            textarea.remove();
        }
    }

    async function reportMemeUsage(meta = {}) {
        const memeId = String(meta.memeId || "").trim();
        if (!memeId) return false;
        try {
            await apiRequest("GET", `${API_PATHS.INCREASE_COPY_COUNT}/${encodeURIComponent(memeId)}`);
            return true;
        } catch (error) {
            console.warn("[dgq63136] 使用次数上报失败", error);
            return false;
        }
    }

    function isReviewEnabled() {
        return Boolean(REVIEW_REPORT_URL && REVIEW_ROUTE_CODE);
    }

    function maskSecret(value) {
        const text = String(value || "").trim();
        if (!text) return "";
        if (text.length <= 8) return `${text.slice(0, 2)}****${text.slice(-2)}`;
        return `${text.slice(0, 4)}****${text.slice(-4)}`;
    }

    function getReviewSettingsOrWarn() {
        const settings = getSettings();
        if (!REVIEW_REPORT_URL || !REVIEW_ROUTE_CODE) {
            showMsg("审功能正在等待房管弹幕管理器接入", "warn");
            return null;
        }
        if (!settings.reviewerToken) {
            showMsg("请先在插件设置里绑定审核码", "warn");
            return null;
        }
        return {
            reviewEndpoint: REVIEW_REPORT_URL,
            reviewRouteCode: REVIEW_ROUTE_CODE,
            reviewerToken: settings.reviewerToken
        };
    }

    function getAttributeByPatterns(element, patterns) {
        if (!element) return "";
        const queue = [];
        const seen = new Set();
        const pushNode = node => {
            if (!node || seen.has(node)) return;
            seen.add(node);
            queue.push(node);
        };
        let current = element;
        let depth = 0;
        while (current && depth < 6) {
            pushNode(current);
            current = current.parentElement;
            depth += 1;
        }
        element.querySelectorAll("[data-uid], [data-user-id], [data-userid], [data-userid64], [data-rid], [uid], [userid], a[href*='uid='], a[href*='user_id='], a[href*='/user/'], a[href*='/u/']").forEach(pushNode);
        for (const node of queue) {
            for (const attr of Array.from(node.attributes || [])) {
                const name = attr.name.toLowerCase();
                const value = String(attr.value || "").trim();
                if (!value) continue;
                if (patterns.some(pattern => pattern.test(name))) return value;
                if (/uid|user.?id|user/i.test(name)) {
                    const match = value.match(/\b(\d{3,})\b/);
                    if (match) return match[1];
                }
                if (name === "href") {
                    const hrefMatch = value.match(/(?:uid|user_id)=?(\d{3,})|\/(?:user|u)\/(\d{3,})/i);
                    if (hrefMatch) return hrefMatch[1] || hrefMatch[2] || "";
                }
            }
        }
        return "";
    }

    function extractUidFromText(text) {
        const clean = String(text || "");
        const match = clean.match(/\b(?:uid|userId|user_id)[:=：\s]*([0-9]{3,})\b/i);
        return match ? match[1] : "";
    }

    function getBarrageSenderUid(root) {
        const attrValue = getAttributeByPatterns(root, [/^data-.*uid$/, /^data-.*user.*id$/, /^uid$/, /^userid$/, /^href$/]);
        const attrMatch = String(attrValue || "").match(/\d{3,}/);
        if (attrMatch) return attrMatch[0];
        const textUid = extractUidFromText(root?.textContent || "");
        return textUid || "";
    }

    function getBarrageSenderName(root) {
        if (!root) return "";
        const selectors = [
            "[class*='nick']",
            "[class*='Nick']",
            "[class*='name']",
            "[class*='Name']",
            "[class*='author']",
            "[class*='Author']",
            ".danmuAuthor-3d7b4a",
            "[class*='danmuAuthor']"
        ];
        for (const selector of selectors) {
            const name = normalizeBarrageText(root.querySelector(selector)?.textContent || "");
            if (name && !isNonChatBarrageText(name)) return name.replace(/[：:]\s*$/, "");
        }
        const fullText = getTextWithoutBarrageActions(root);
        const match = fullText.match(/^([^：:]{1,30})[：:]\s*.+$/);
        return match ? normalizeBarrageText(match[1]) : "";
    }

    function createMessageFingerprint(roomId, senderIdentity, text) {
        const input = `${roomId}|${normalizeBarrageText(senderIdentity)}|${normalizeBarrageText(text)}`;
        let hash = 0;
        for (let index = 0; index < input.length; index += 1) {
            hash = ((hash << 5) - hash + input.charCodeAt(index)) | 0;
        }
        return Math.abs(hash).toString(36);
    }

    function buildReviewPayload(text, meta = {}) {
        const roomId = String(meta.roomId || getRoomId() || "").trim();
        const senderUid = String(meta.senderUid || "").trim();
        const senderName = normalizeBarrageText(meta.senderName || "");
        const messageText = normalizeBarrageText(text);
        return {
            source: "dgq63136-userscript",
            version: DISPLAY_VERSION,
            technicalVersion: CURRENT_VERSION,
            roomId,
            senderUid,
            senderName,
            messageText,
            messageFingerprint: createMessageFingerprint(roomId, senderUid || senderName, messageText),
            messageTime: meta.messageTime || new Date().toISOString(),
            pageUrl: location.href,
            reporterClientId: getOrCreateReviewClickerId()
        };
    }

    async function reportBarrageReview(text, meta = {}) {
        const settings = getReviewSettingsOrWarn();
        if (!settings) return false;
        const payload = buildReviewPayload(text, meta);
        if (!payload.messageText) {
            showMsg("没有可审的弹幕", "warn");
            return false;
        }
        if (!payload.senderName) {
            showMsg("没有识别到发送昵称，请在右侧聊天列表点击“审”", "warn");
            return false;
        }
        if (!payload.roomId) {
            showMsg("没有识别到当前直播间号，不能提交审", "warn");
            return false;
        }
        try {
            const response = await externalJsonRequest("POST", settings.reviewEndpoint, payload, {
                "X-DGQ-Review-Code": settings.reviewRouteCode,
                "X-DGQ-Reviewer-Token": settings.reviewerToken
            });
            const message = response?.message || response?.msg || "已提交到房管待审";
            showMsg(message);
            return true;
        } catch (error) {
            console.warn("[dgq63136] 审上报失败", error);
            const reason = error?.payload?.reason || error?.payload?.message || error?.payload?.msg || error?.message || "请稍后再试";
            showMsg(`审提交失败：${String(reason).replace(/^HTTP\\s+\\d+\\s*:\\s*/i, "").slice(0, 80)}`, "error");
            return false;
        }
    }

    function setInputText(input, text) {
        if ("value" in input) {
            const descriptor = Object.getOwnPropertyDescriptor(input.constructor.prototype, "value");
            if (descriptor?.set) {
                descriptor.set.call(input, text);
            } else {
                input.value = text;
            }
        } else {
            input.innerText = text;
        }
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function sendBarrage(text, meta = {}, options = {}) {
        text = normalizeBarrageText(text);
        if (!text) return;
        if (getSettings().confirmBeforeSend && !options.confirmed) {
            openSendConfirmDialog(text, () => sendBarrage(text, meta, { confirmed: true }));
            return;
        }
        if (state.cooldown) {
            showMsg("CD冷却中...", "warn");
            return;
        }
        const chatInput = querySelectorDeep(".ChatSend-txt");
        const sendBtn = querySelectorDeep(".ChatSend-button");
        if (!chatInput || !sendBtn) {
            showMsg("没有找到斗鱼发送框", "error");
            return;
        }

        chatInput.focus();
        setInputText(chatInput, text);
        setTimeout(() => {
            sendBtn.click();
            state.cooldown = true;
            setTimeout(() => {
                state.cooldown = false;
            }, 5000);
            addRecentUsage(text, { ...meta, action: "send" });
            reportMemeUsage(meta);
            showMsg("弹幕发送成功");
        }, 50);
    }

    function showMsg(text, type = "success") {
        const message = createElement("div", { }, text);
        message.className = `dgq-toast dgq-toast-${type}`;
        document.body.appendChild(message);
        setTimeout(() => {
            message.style.opacity = "0";
            setTimeout(() => message.remove(), 1000);
        }, 1600);
    }

    function clearTitleActions() {
        if (state.tableTitleActions) state.tableTitleActions.innerHTML = "";
    }

    function setTitleActions(builder) {
        clearTitleActions();
        if (typeof builder === "function" && state.tableTitleActions) builder(state.tableTitleActions);
    }

    function renderModeTabs() {
        for (const tab of MODE_TABS) {
            const button = state.modeTabs[tab.value];
            if (!button) continue;
            button.classList.toggle("is-active", state.mode === tab.value);
            if (tab.value === "favorites") {
                button.textContent = `收藏(${getFavorites().length})`;
            } else if (tab.value === "recents") {
                button.textContent = `最近(${getRecents().length})`;
            } else {
                button.textContent = tab.label;
            }
        }
    }

    function getShortcutTags() {
        const byLabel = label => state.tagOptions.find(tag => tag.label === label || tag.label.replace(/\s+/g, "") === label.replace(/\s+/g, ""));
        const tags = QUICK_TAG_LABELS.map(byLabel).filter(Boolean);
        const seen = new Set();
        for (const tag of state.tagOptions) {
            if (tags.length >= 4) break;
            if (seen.has(tag.value) || tags.some(item => item.value === tag.value)) continue;
            tags.push(tag);
            seen.add(tag.value);
        }
        return tags.slice(0, 4);
    }

    function renderShortcutTags() {
        if (!state.shortcutTagsWrap) return;
        state.shortcutTagsWrap.innerHTML = "";
        for (const tag of getShortcutTags()) {
            const button = document.createElement("button");
            button.className = "dgq-shortcut-tag";
            button.type = "button";
            button.textContent = tag.label;
            button.title = `查看分类：${tag.label}`;
            button.addEventListener("click", () => {
                setDefaultTags([tag.value]);
                renderTagSelect();
                loadCategoryMemes(tag.value, 1, state.categorySort);
            });
            state.shortcutTagsWrap.appendChild(button);
        }

        const moreButton = document.createElement("button");
        moreButton.className = "dgq-shortcut-tag is-more";
        moreButton.type = "button";
        moreButton.textContent = "更多";
        moreButton.title = "打开全部分类";
        moreButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            setTagPickerOpen(true);
        });
        state.shortcutTagsWrap.appendChild(moreButton);
    }

    function hideHotSection() {
        state.hotExpanded = false;
        if (state.hotSection) state.hotSection.hidden = true;
        updateHotToggle();
    }

    function switchMode(mode) {
        if (!MODE_TABS.some(tab => tab.value === mode)) mode = "search";
        state.mode = mode;
        clearTitleActions();
        hideHotSection();
        renderModeTabs();
        if (mode === "search") {
            setTableTitle(state.searchRows.length ? `搜索结果：${state.searchRows.length} 条；点击弹幕文本复制。` : "输入关键词后点击搜索；也可选择分类浏览弹幕。");
            renderRows(state.searchRows, { emptyText: "输入关键词后点击搜索；搜索结果可发送、投稿、收藏。" });
        } else if (mode === "category") {
            loadCategoryMemes(state.categoryTag || getDefaultTags()[0] || DEFAULT_SUBMIT_TAG, state.categoryPage || 1, state.categorySort);
        } else if (mode === "hot") {
            state.hotExpanded = true;
            if (state.hotSection) state.hotSection.hidden = false;
            updateHotToggle();
            setTableTitle("热门弹幕：实时 / 5分钟 / 24小时 / 7天热门可直接发送、收藏。");
            state.currentRows = [];
            state.table.innerHTML = "";
            loadHotMemes(state.hotTab);
        } else if (mode === "recents") {
            renderRecents(1);
        } else if (mode === "favorites") {
            renderFavorites(1, state.favoriteFilterTag);
        } else if (mode === "settings") {
            renderSettings();
        }
    }

    function createToolbarButton(left, label, title, color, onClick) {
        const button = document.createElement("button");
        button.className = "dgq-icon-btn";
        button.style.left = left;
        button.title = title || label;
        button.type = "button";
        button.innerHTML = `
            <svg viewBox="0 0 1024 1024" width="20" height="20" aria-hidden="true">
                <path fill="${color}" d="M512 96 128 448v480h272V640h224v288h272V448L512 96z"></path>
            </svg>
            <span>${label}</span>
        `;
        button.addEventListener("click", onClick);
        return button;
    }

    function createMainPanel() {
        if (state.panelCreated) return document.getElementById("dgq63136-panel");
        state.panelCreated = true;
        const panel = document.createElement("div");
        panel.id = "dgq63136-panel";
        document.body.appendChild(panel);

        const toolbar = document.createElement("div");
        toolbar.className = "dgq-toolbar";
        panel.appendChild(toolbar);

        const headerLeft = document.createElement("div");
        headerLeft.className = "dgq-header-left";
        headerLeft.innerHTML = `
            <div class="dgq-brand-line">
                <strong>63136 弹幕库</strong>
                <span class="dgq-version-badge">${DISPLAY_VERSION}</span>
            </div>
            <div class="dgq-brand-subtitle">搜索 / 分类 / 热榜 / 最近 / 收藏 / 设置</div>
        `;
        toolbar.appendChild(headerLeft);

        const updateTip = document.createElement("button");
        updateTip.className = "dgq-update-tip";
        updateTip.type = "button";
        updateTip.textContent = "检测到新版本";
        updateTip.addEventListener("click", () => toggleUpdateCard());
        state.updateTipEl = updateTip;

        const onlineCount = document.createElement("div");
        onlineCount.className = "dgq-online-count";
        onlineCount.innerHTML = `
            <div id="gf-online-dgq">插件在线：--</div>
            <div id="site-online-dgq">网站在线：--</div>
        `;

        const headerActions = document.createElement("div");
        headerActions.className = "dgq-header-actions";
        toolbar.appendChild(headerActions);

        function appendHeaderAction(label, title, onClick) {
            const button = document.createElement("button");
            button.className = "dgq-header-link";
            button.type = "button";
            button.textContent = label;
            button.title = title || label;
            button.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                onClick();
            });
            headerActions.appendChild(button);
            return button;
        }

        headerActions.appendChild(updateTip);
        headerActions.appendChild(onlineCount);
        appendHeaderAction("首页", "打开63136首页", () => openExternalUrl("https://dgq63136.cn"));
        appendHeaderAction("反馈", "打开反馈问卷", () => openExternalUrl("https://www.wjx.cn/vm/rQUgnS0.aspx#"));
        appendHeaderAction("更新", "检测插件更新", () => openUpdateDialog());

        const closeButton = document.createElement("button");
        closeButton.className = "dgq-close-btn";
        closeButton.type = "button";
        closeButton.textContent = "x";
        closeButton.addEventListener("click", () => togglePanel(false));
        toolbar.appendChild(closeButton);

        const updateCard = document.createElement("div");
        updateCard.className = "dgq-update-card";
        panel.appendChild(updateCard);
        state.updateCardEl = updateCard;

        const modeTabs = document.createElement("div");
        modeTabs.className = "dgq-mode-tabs";
        panel.appendChild(modeTabs);
        for (const tab of MODE_TABS) {
            const button = document.createElement("button");
            button.className = "dgq-mode-tab";
            button.type = "button";
            button.textContent = tab.label;
            button.addEventListener("click", () => switchMode(tab.value));
            modeTabs.appendChild(button);
            state.modeTabs[tab.value] = button;
        }

        const searchWrap = document.createElement("div");
        searchWrap.className = "dgq-search-wrap";
        panel.appendChild(searchWrap);

        const input = document.createElement("input");
        input.placeholder = "搜索弹幕...";
        searchWrap.appendChild(input);
        state.searchInput = input;

        const searchButton = document.createElement("button");
        searchButton.className = "dgq-primary-btn";
        searchButton.type = "button";
        searchButton.textContent = "搜索";
        searchWrap.appendChild(searchButton);

        const randomButton = document.createElement("button");
        randomButton.className = "dgq-primary-btn dgq-random-btn";
        randomButton.type = "button";
        randomButton.textContent = "随机";
        randomButton.title = "从当前模块随机来一条";
        randomButton.addEventListener("click", () => pickRandomMeme());
        searchWrap.appendChild(randomButton);
        state.randomButton = randomButton;

        const shortcutTagsWrap = document.createElement("div");
        shortcutTagsWrap.className = "dgq-shortcut-tags";
        panel.appendChild(shortcutTagsWrap);
        state.shortcutTagsWrap = shortcutTagsWrap;

        const settingsWrap = document.createElement("div");
        settingsWrap.className = "dgq-settings-wrap";
        panel.appendChild(settingsWrap);

        const label = document.createElement("label");
        label.textContent = "查看及投稿分类";
        settingsWrap.appendChild(label);

        const tagPicker = document.createElement("div");
        tagPicker.className = "dgq-tag-picker";
        settingsWrap.appendChild(tagPicker);

        const tagPickerButton = document.createElement("button");
        tagPickerButton.className = "dgq-tag-picker-button";
        tagPickerButton.type = "button";
        tagPickerButton.setAttribute("aria-haspopup", "listbox");
        tagPicker.appendChild(tagPickerButton);
        state.tagPickerButton = tagPickerButton;

        const tagPickerMenu = document.createElement("div");
        tagPickerMenu.className = "dgq-tag-picker-menu";
        tagPickerMenu.setAttribute("role", "listbox");
        tagPickerMenu.hidden = true;
        tagPicker.appendChild(tagPickerMenu);
        state.tagPickerMenu = tagPickerMenu;

        tagPickerButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            setTagPickerOpen(!state.tagPickerOpen);
        });

        tagPickerMenu.addEventListener("click", event => {
            const option = event.target.closest(".dgq-tag-picker-option");
            if (!option) return;
            event.preventDefault();
            event.stopPropagation();
            const value = option.dataset.value || DEFAULT_SUBMIT_TAG;
            setDefaultTags([value]);
            setTagPickerOpen(false);
            renderTagSelect();
            showMsg(`查看及投稿分类：${getTagLabel(value)}`);
            loadCategoryMemes(value, 1);
        });

        document.addEventListener("click", event => {
            if (!tagPicker.contains(event.target)) setTagPickerOpen(false);
        });
        window.addEventListener("resize", () => {
            if (state.tagPickerOpen) positionTagPickerMenu();
        });

        const favoritesButton = document.createElement("button");
        favoritesButton.className = "dgq-secondary-btn";
        favoritesButton.type = "button";
        settingsWrap.appendChild(favoritesButton);
        state.favoritesBtn = favoritesButton;
        favoritesButton.addEventListener("click", () => {
            switchMode(state.mode === "favorites" ? "search" : "favorites");
        });

        const tableTitle = document.createElement("div");
        tableTitle.className = "dgq-table-title";
        panel.appendChild(tableTitle);
        state.tableTitle = tableTitle;

        const tableTitleText = document.createElement("span");
        tableTitleText.className = "dgq-table-title-text";
        tableTitle.appendChild(tableTitleText);
        state.tableTitleText = tableTitleText;

        const tableTitleActions = document.createElement("div");
        tableTitleActions.className = "dgq-table-title-actions";
        tableTitle.appendChild(tableTitleActions);
        state.tableTitleActions = tableTitleActions;

        const hotToggleButton = document.createElement("button");
        hotToggleButton.className = "dgq-hot-toggle";
        hotToggleButton.type = "button";
        hotToggleButton.title = "展开最近热门弹幕";
        hotToggleButton.addEventListener("click", () => setHotPanelExpanded(!state.hotExpanded));
        tableTitle.appendChild(hotToggleButton);
        state.hotToggleButton = hotToggleButton;

        const hotSection = document.createElement("div");
        hotSection.className = "dgq-hot-section";
        hotSection.hidden = true;
        panel.appendChild(hotSection);
        state.hotSection = hotSection;

        const hotTabs = document.createElement("div");
        hotTabs.className = "dgq-hot-tabs";
        hotSection.appendChild(hotTabs);

        const hotRealtimeButton = document.createElement("button");
        hotRealtimeButton.className = "dgq-hot-tab";
        hotRealtimeButton.type = "button";
        hotRealtimeButton.textContent = "实时";
        hotRealtimeButton.setAttribute("data-hot-tab", "realtime");
        hotRealtimeButton.addEventListener("click", () => setHotTab("realtime"));
        hotTabs.appendChild(hotRealtimeButton);
        state.hotTabs["realtime"] = hotRealtimeButton;

        const hotFiveButton = document.createElement("button");
        hotFiveButton.className = "dgq-hot-tab";
        hotFiveButton.type = "button";
        hotFiveButton.textContent = "5分钟";
        hotFiveButton.setAttribute("data-hot-tab", "five");
        hotFiveButton.addEventListener("click", () => setHotTab("five"));
        hotTabs.appendChild(hotFiveButton);
        state.hotTabs["five"] = hotFiveButton;

        const hot24Button = document.createElement("button");
        hot24Button.className = "dgq-hot-tab";
        hot24Button.type = "button";
        hot24Button.textContent = "24小时热门";
        hot24Button.setAttribute("data-hot-tab", "24h");
        hot24Button.addEventListener("click", () => setHotTab("24h"));
        hotTabs.appendChild(hot24Button);
        state.hotTabs["24h"] = hot24Button;

        const hot7dButton = document.createElement("button");
        hot7dButton.className = "dgq-hot-tab";
        hot7dButton.type = "button";
        hot7dButton.textContent = "7天热门";
        hot7dButton.setAttribute("data-hot-tab", "7d");
        hot7dButton.addEventListener("click", () => setHotTab("7d"));
        hotTabs.appendChild(hot7dButton);
        state.hotTabs["7d"] = hot7dButton;

        const hotRefreshButton = document.createElement("button");
        hotRefreshButton.className = "dgq-hot-refresh";
        hotRefreshButton.type = "button";
        hotRefreshButton.textContent = "刷新";
        hotRefreshButton.addEventListener("click", () => loadHotMemes(state.hotTab, true));
        hotTabs.appendChild(hotRefreshButton);

        const hotList = document.createElement("div");
        hotList.className = "dgq-hot-list";
        hotSection.appendChild(hotList);
        state.hotList = hotList;

        const scrollBox = document.createElement("div");
        scrollBox.className = "dgq-scroll-box";
        panel.appendChild(scrollBox);

        const table = document.createElement("table");
        table.className = "dgq-table";
        scrollBox.appendChild(table);
        state.table = table;

        input.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                searchButton.click();
            }
        });
        searchButton.addEventListener("click", () => searchMemes(input.value));

        state.settings = getSettings();
        enableDrag(panel, toolbar);
        applyLayoutMode();
        updateFavoritesCount();
        renderTagSelect();
        renderShortcutTags();
        renderModeTabs();
        setTableTitle("输入关键词后点击搜索；也可选择分类浏览弹幕。");
        updateHotToggle();
        renderHotTabs();
        return panel;
    }

    function renderTagSelect() {
        if (!state.tagPickerButton || !state.tagPickerMenu) return;
        const selected = getDefaultTags()[0] || DEFAULT_SUBMIT_TAG;
        const options = state.tagOptions.some(tag => tag.value === selected)
            ? state.tagOptions
            : state.tagOptions.concat({ label: selected, value: selected });
        const selectedOption = options.find(tag => tag.value === selected) || options[0] || { label: DEFAULT_SUBMIT_TAG, value: DEFAULT_SUBMIT_TAG };

        state.tagPickerButton.textContent = selectedOption.label;
        state.tagPickerButton.title = `查看及投稿分类：${selectedOption.label}`;
        state.tagPickerButton.setAttribute("aria-expanded", state.tagPickerOpen ? "true" : "false");
        state.tagPickerMenu.innerHTML = "";
        for (const tag of options) {
            const option = document.createElement("button");
            option.className = "dgq-tag-picker-option";
            option.type = "button";
            option.dataset.value = tag.value;
            option.textContent = tag.label;
            option.setAttribute("role", "option");
            option.setAttribute("aria-selected", tag.value === selected ? "true" : "false");
            if (tag.value === selected) option.classList.add("is-selected");
            state.tagPickerMenu.appendChild(option);
        }
        if (state.tagPickerOpen) positionTagPickerMenu();
    }

    function positionTagPickerMenu() {
        if (!state.tagPickerButton || !state.tagPickerMenu || state.tagPickerMenu.hidden) return;
        const rect = state.tagPickerButton.getBoundingClientRect();
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 430;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 560;
        const margin = 8;
        const menuGap = 4;
        const maxHeight = 240;
        const minHeight = 120;
        const belowSpace = viewportHeight - rect.bottom - margin;
        const aboveSpace = rect.top - margin;
        const openUp = belowSpace < 180 && aboveSpace > belowSpace;
        const availableSpace = Math.max(minHeight, Math.min(maxHeight, openUp ? aboveSpace : belowSpace));
        const width = Math.max(150, Math.round(rect.width));
        const left = Math.max(margin, Math.min(rect.left, viewportWidth - width - margin));
        const top = openUp
            ? Math.max(margin, rect.top - availableSpace - menuGap)
            : Math.min(viewportHeight - margin - availableSpace, rect.bottom + menuGap);

        state.tagPickerMenu.classList.toggle("is-upward", openUp);
        state.tagPickerMenu.style.left = `${Math.round(left)}px`;
        state.tagPickerMenu.style.top = `${Math.round(top)}px`;
        state.tagPickerMenu.style.width = `${width}px`;
        state.tagPickerMenu.style.maxHeight = `${Math.round(availableSpace)}px`;
    }

    function setTagPickerOpen(open) {
        state.tagPickerOpen = Boolean(open);
        if (state.tagPickerMenu) {
            state.tagPickerMenu.hidden = !state.tagPickerOpen;
            if (state.tagPickerOpen) positionTagPickerMenu();
        }
        if (state.tagPickerButton) state.tagPickerButton.setAttribute("aria-expanded", state.tagPickerOpen ? "true" : "false");
    }

    function setTableTitle(message) {
        if (state.tableTitleText) {
            state.tableTitleText.textContent = message;
            return;
        }
        if (state.tableTitle) state.tableTitle.textContent = message;
    }

    function updateHotToggle() {
        if (!state.hotToggleButton) return;
        state.hotToggleButton.textContent = state.hotExpanded ? "热梗 ▴" : "热梗 ▾";
        state.hotToggleButton.title = state.hotExpanded ? "收起最近热门弹幕" : "展开最近热门弹幕";
        state.hotToggleButton.setAttribute("aria-expanded", state.hotExpanded ? "true" : "false");
    }

    function renderHotTabs() {
        for (const [tab, button] of Object.entries(state.hotTabs)) {
            button.classList.toggle("is-active", tab === state.hotTab);
        }
    }

    function isHotwallTab(tab) {
        return tab === "realtime" || tab === "five";
    }

    function getHotPath(tab) {
        return tab === "7d" ? API_PATHS.HOT_MEME_7D : API_PATHS.HOT_MEME_24H;
    }

    function normalizeHotRows(items, tab) {
        if (!Array.isArray(items)) return [];
        return items.map(item => normalizeMemeRow(item, {
                source: tab === "7d" ? "hot-7d" : "hot-24h",
                memeId: String(item?.barrageId || item?.id || ""),
                time: item?.hotDateTime || ""
            })).filter(item => item.content).slice(0, LIST_PAGE_SIZE);
    }


    function hotwallTypeName(type) {
        return {
            submit: "投稿",
            copy: "复制",
            search: "搜索",
            view: "浏览",
            pick: "选梗",
            burst: "爆发"
        }[type] || type || "实时";
    }

    function formatHotwallTime(time) {
        const date = new Date(Number(time) || time || Date.now());
        const pad = value => String(value).padStart(2, "0");
        return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    function parseHotwallSseText(text) {
        const result = { ranking: [], events: [] };
        if (typeof text !== "string" || !text.trim()) return result;
        const blocks = text.split(/\r?\n\r?\n+/);
        for (const block of blocks) {
            if (!block.trim()) continue;
            let eventName = "";
            let dataText = "";
            for (const line of block.split(/\r?\n/)) {
                if (line.startsWith("event:")) eventName = line.replace(/^event:\s*/, "").trim();
                if (line.startsWith("data:")) dataText += line.replace(/^data:\s?/, "");
            }
            if (!dataText) continue;
            const data = parseJsonSafe(dataText, null);
            if (!data) continue;
            if (eventName === "snapshot" && Array.isArray(data.items)) {
                result.ranking = data.items;
            } else if (eventName === "event" && data.barrage) {
                result.events.push(data);
            }
        }
        return result;
    }

    function normalizeHotwallRankRows(items) {
        if (!Array.isArray(items)) return [];
        return items.map(item => {
            const row = normalizeMemeRow(item, {
                source: "hotwall-5m",
                memeId: String(item?.barrageId || item?.id || ""),
                time: item?.submitTime || ""
            });
            row.hotCount = Number(item?.count || 0) || 0;
            row.hotMeta = `5分钟热度：${row.hotCount}`;
            return row;
        }).filter(item => item.content).slice(0, HOTWALL_RANK_LIMIT);
    }

    function normalizeHotwallEventRows(items) {
        if (!Array.isArray(items)) return [];
        return items
            .slice()
            .sort((left, right) => Number(right?.time || 0) - Number(left?.time || 0))
            .map(item => {
            const row = normalizeMemeRow({
                barrage: item?.barrage || "",
                time: item?.time || Date.now()
            }, {
                source: "hotwall-realtime",
                time: item?.time || Date.now()
            });
            row.hotMeta = `${hotwallTypeName(item?.type)} · ${formatHotwallTime(item?.time)}`;
            return row;
        }).filter(item => item.content).slice(0, HOTWALL_STREAM_LIMIT);
    }

    async function requestHotwallSnapshot(tab = state.hotTab) {
        if (state.hotwallRequest && typeof state.hotwallRequest.abort === "function") {
            try { state.hotwallRequest.abort(); } catch (error) { /* ignore */ }
        }
        const controller = new AbortController();
        state.hotwallRequest = controller;
        const latestParsed = { ranking: [], events: [] };
        const updateParsed = text => {
            const parsed = parseHotwallSseText(text);
            if (parsed.ranking.length) latestParsed.ranking = parsed.ranking.slice(0, HOTWALL_RANK_LIMIT);
            if (parsed.events.length) {
                latestParsed.events = parsed.events
                    .slice()
                    .sort((left, right) => Number(right?.time || 0) - Number(left?.time || 0))
                    .slice(0, HOTWALL_STREAM_LIMIT);
            }
        };
        const hasEnoughData = () => (
            tab === "five"
                ? latestParsed.ranking.length > 0
                : tab === "realtime"
                    ? latestParsed.events.length >= HOTWALL_STREAM_LIMIT
                    : latestParsed.ranking.length > 0 || latestParsed.events.length > 0
        );
        const timer = setTimeout(() => controller.abort(), 12000);
        try {
            const response = await fetch(API_BASE_URL + API_PATHS.HOTWALL_STREAM, {
                method: "GET",
                headers: {
                    "dpahjdoiaw": API_AUTH_HEADER,
                    "siteToken": getOrCreateSiteToken()
                },
                signal: controller.signal
            });
            if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                updateParsed(buffer);
                if (hasEnoughData()) {
                    try { await reader.cancel(); } catch (error) { /* ignore */ }
                    break;
                }
            }
        } catch (error) {
            if (!hasEnoughData()) throw error;
        } finally {
            clearTimeout(timer);
            if (state.hotwallRequest === controller) state.hotwallRequest = null;
            try { controller.abort(); } catch (error) { /* ignore */ }
        }
        if (latestParsed.ranking.length || latestParsed.events.length) return latestParsed;
        throw new Error("hotwall empty");
    }
    async function loadHotwallMemes(tab) {
        const payload = await requestHotwallSnapshot(tab);
        const realtimeRows = normalizeHotwallEventRows(payload.events);
        const fiveRows = normalizeHotwallRankRows(payload.ranking);
        state.hotCache.realtime = realtimeRows;
        state.hotCache.five = fiveRows;
        if (state.hotTab !== tab) return;
        if (tab === "five") {
            renderHotRows(fiveRows);
            return;
        }
        if (realtimeRows.length) {
            renderHotRows(realtimeRows);
            return;
        }
        renderHotEmpty("实时暂无新弹幕，稍后点击刷新。");
    }
    function renderHotEmpty(message) {
        if (!state.hotList) return;
        state.hotList.innerHTML = "";
        const empty = document.createElement("div");
        empty.className = "dgq-hot-empty";
        empty.textContent = message;
        state.hotList.appendChild(empty);
    }

    function renderHotRows(rows) {
        if (!state.hotList) return;
        state.currentRows = rows;
        state.hotList.innerHTML = "";
        if (!rows.length) {
            renderHotEmpty("暂无热门弹幕，稍后再试。");
            return;
        }
        for (const row of rows) {
            const item = document.createElement("div");
            item.className = "dgq-hot-item";

            const main = document.createElement("div");
            main.className = "dgq-hot-main";

            const content = document.createElement("div");
            content.className = "dgq-hot-content";
            content.textContent = row.content;
            content.title = "点击复制：" + row.content;
            content.addEventListener("click", () => copyText(row.content, row.meta));
            main.appendChild(content);

            const meta = document.createElement("div");
            meta.className = "dgq-hot-meta";
            meta.textContent = row.hotMeta || buildMetaText(row, true);
            main.appendChild(meta);

            item.appendChild(main);

            const actions = document.createElement("div");
            actions.className = "dgq-hot-actions";
            actions.appendChild(createActionButton("dgq-send", getActionLabel("发送", "发"), "发送到斗鱼弹幕输入框", () => sendBarrage(row.content, row.meta)));
            actions.appendChild(createActionButton("dgq-favorite", "收藏", "收藏到插件本地", () => addFavorite(row.content, row.meta)));
            item.appendChild(actions);

            state.hotList.appendChild(item);
        }
    }

    async function loadHotMemes(tab = state.hotTab, force = false) {
        if (state.hotLoading) {
            renderHotEmpty("热门弹幕加载中...");
            return;
        }
        if (!force && state.hotCache[tab]?.length) {
            renderHotRows(state.hotCache[tab]);
            return;
        }
        state.hotLoading = true;
        state.hotLoadingTab = tab;
        renderHotEmpty("热门弹幕加载中...");
        try {
            if (isHotwallTab(tab)) {
                await loadHotwallMemes(tab);
                return;
            }
            const response = await apiRequest("GET", getHotPath(tab));
            if (response?.code === 200 && Array.isArray(response.data)) {
                const rows = normalizeHotRows(response.data, tab);
                state.hotCache[tab] = rows;
                if (state.hotTab === tab) renderHotRows(rows);
                return;
            }
            if (state.hotTab === tab) renderHotEmpty(response?.msg || "热门弹幕加载失败。");
        } catch (error) {
            console.warn("[dgq63136] 热门弹幕加载失败", error);
            if (state.hotTab === tab) renderHotEmpty("热门弹幕加载失败，请稍后再试。");
        } finally {
            const activeTabNeedsLoad = state.hotExpanded && state.hotTab !== state.hotLoadingTab && !state.hotCache[state.hotTab]?.length;
            state.hotLoading = false;
            state.hotLoadingTab = "";
            if (activeTabNeedsLoad) loadHotMemes(state.hotTab);
        }
    }

    function setHotTab(tab) {
        const nextTab = ["realtime", "five", "24h", "7d"].includes(tab) ? tab : "24h";
        state.hotTab = nextTab;
        renderHotTabs();
        loadHotMemes(state.hotTab);
    }

    function setHotPanelExpanded(expanded) {
        state.hotExpanded = Boolean(expanded);
        if (state.hotExpanded) {
            state.mode = "hot";
            renderModeTabs();
            setTableTitle("热门弹幕：实时 / 5分钟 / 24小时 / 7天热门可直接发送、收藏。");
            state.currentRows = [];
            state.table.innerHTML = "";
        }
        if (state.hotSection) state.hotSection.hidden = !state.hotExpanded;
        updateHotToggle();
        if (state.hotExpanded) loadHotMemes(state.hotTab);
    }

    function renderEmpty(message) {
        setTableTitle(message);
        clearTitleActions();
        state.currentRows = [];
        state.table.innerHTML = "";
    }

    function getActionLabel(standard, compact) {
        return getSettings().layoutMode === "compact" ? compact : standard;
    }

    function buildMetaText(row, compact = false) {
        const tagText = getTagLabels(row.tags).join(" / ");
        const timeText = row.displayTime || formatDisplayTimeToMinute(row.usedAt) || "";
        if (compact || getSettings().layoutMode === "compact") {
            return `${tagText} · ${timeText || "无时间"} · 复${row.copyCount || 0} · 赞${row.likes || 0}`;
        }
        const firstLine = `标签：${tagText}`;
        const secondLine = `时间：${timeText || "无"}　复制：${row.copyCount || 0}　点赞：${row.likes || 0}`;
        const actionLine = row.action ? `最近动作：${formatRecentAction(row.action)}　使用：${formatDisplayTimeToMinute(row.usedAt) || row.usedAt || ""}` : "";
        return [firstLine, secondLine, actionLine].filter(Boolean).join("\n");
    }

    function appendMetaLines(container, row) {
        const meta = document.createElement("div");
        meta.className = "dgq-row-meta";
        for (const line of buildMetaText(row).split("\n")) {
            const span = document.createElement("span");
            span.className = "dgq-row-meta-line";
            span.textContent = line;
            meta.appendChild(span);
        }
        container.appendChild(meta);
    }

    function formatRecentAction(action) {
        return {
            copy: "复制",
            send: "发送",
            submit: "投稿",
            favorite: "收藏"
        }[action] || action || "使用";
    }

    function createActionButton(className, text, title, onClick) {
        const button = document.createElement("button");
        button.className = `dgq-mini-btn ${className}`;
        button.type = "button";
        button.textContent = text;
        button.title = title || text;
        button.addEventListener("click", event => {
            event.stopPropagation();
            onClick();
        });
        return button;
    }

    function renderRows(rows, options = {}) {
        rows = Array.isArray(rows) ? rows : [];
        state.currentRows = rows;
        state.table.innerHTML = "";
        if (rows.length === 0) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 2;
            td.textContent = options.emptyText || "没有内容";
            tr.appendChild(td);
            state.table.appendChild(tr);
            return;
        }

        for (const row of rows) {
            const tr = document.createElement("tr");
            const contentTd = document.createElement("td");
            contentTd.className = "dgq-content-cell";
            contentTd.title = "点击复制";
            contentTd.addEventListener("click", () => copyText(row.content, row.meta));

            const contentText = document.createElement("div");
            contentText.className = "dgq-content-text";
            contentText.textContent = row.content;
            contentTd.appendChild(contentText);

            appendMetaLines(contentTd, row);
            tr.appendChild(contentTd);

            const actionsTd = document.createElement("td");
            actionsTd.className = "dgq-actions-cell";
            const actions = document.createElement("div");
            actions.className = "dgq-actions";
            actions.appendChild(createActionButton("dgq-send", getActionLabel("发送", "发"), "发送到斗鱼弹幕输入框", () => sendBarrage(row.content, row.meta)));
            actions.appendChild(createActionButton("dgq-submit", getActionLabel("投稿", "投"), "选择标签后投稿到63136烂梗网站", () => openSubmitTagDialog(row.content, row.meta)));
            if (options.favoriteMode) {
                actions.appendChild(createActionButton("dgq-remove", "删除", "从本地收藏删除", () => removeFavorite(row.id)));
            } else {
                actions.appendChild(createActionButton("dgq-favorite", getActionLabel("收藏", "藏"), "收藏到插件本地", () => addFavorite(row.content, row.meta)));
            }
            actionsTd.appendChild(actions);
            tr.appendChild(actionsTd);
            state.table.appendChild(tr);
        }
        if (options.pager) renderListPager(options.pager);
    }

    function renderListPager({ pageNum, pageCount, onPrev, onNext }) {
        if (!state.table || pageCount <= 1) return;
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.className = "dgq-category-pager-cell";
        td.colSpan = 2;

        const wrap = document.createElement("div");
        wrap.className = "dgq-category-pager";

        const prevButton = document.createElement("button");
        prevButton.className = "dgq-category-page-btn";
        prevButton.type = "button";
        prevButton.textContent = "上一页";
        prevButton.disabled = pageNum <= 1;
        prevButton.addEventListener("click", onPrev);
        wrap.appendChild(prevButton);

        const info = document.createElement("span");
        info.className = "dgq-category-page-info";
        info.textContent = `${pageNum}/${pageCount}`;
        wrap.appendChild(info);

        const nextButton = document.createElement("button");
        nextButton.className = "dgq-category-page-btn";
        nextButton.type = "button";
        nextButton.textContent = "下一页";
        nextButton.disabled = pageNum >= pageCount;
        nextButton.addEventListener("click", onNext);
        wrap.appendChild(nextButton);

        td.appendChild(wrap);
        tr.appendChild(td);
        state.table.appendChild(tr);
    }

    function getCategoryPageCount(total) {
        return Math.max(1, Math.ceil((Number(total) || 0) / CATEGORY_PAGE_SIZE));
    }

    function normalizeCategoryRows(items, tagValue) {
        if (!Array.isArray(items)) return [];
        return items.map(item => normalizeMemeRow(item, {
                source: "category",
                tag: tagValue,
                tags: item?.tags || tagValue,
                memeId: String(item?.id || item?.barrageId || ""),
                time: item?.submitTime || ""
            })).filter(item => item.content);
    }

    function renderCategoryPager(tagValue, pageNum, total) {
        if (!state.table) return;
        const pageCount = getCategoryPageCount(total);
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.className = "dgq-category-pager-cell";
        td.colSpan = 2;

        const wrap = document.createElement("div");
        wrap.className = "dgq-category-pager";

        const prevButton = document.createElement("button");
        prevButton.className = "dgq-category-page-btn";
        prevButton.type = "button";
        prevButton.textContent = "上一页";
        prevButton.disabled = pageNum <= 1;
        prevButton.addEventListener("click", () => loadCategoryMemes(tagValue, pageNum - 1, state.categorySort));
        wrap.appendChild(prevButton);

        const info = document.createElement("span");
        info.className = "dgq-category-page-info";
        info.textContent = `${pageNum}/${pageCount}`;
        wrap.appendChild(info);

        const nextButton = document.createElement("button");
        nextButton.className = "dgq-category-page-btn";
        nextButton.type = "button";
        nextButton.textContent = "下一页";
        nextButton.disabled = pageNum >= pageCount;
        nextButton.addEventListener("click", () => loadCategoryMemes(tagValue, pageNum + 1, state.categorySort));
        wrap.appendChild(nextButton);

        td.appendChild(wrap);
        tr.appendChild(td);
        state.table.appendChild(tr);
    }

    function renderCategorySortControls() {
        setTitleActions(actions => {
            for (const option of CATEGORY_SORT_OPTIONS) {
                const button = document.createElement("button");
                button.className = "dgq-sort-btn";
                button.type = "button";
                button.textContent = option.label;
                button.title = `按${option.label}排序，排序由后端 sort=${option.value} 返回`;
                button.classList.toggle("is-active", state.categorySort === option.value);
                button.addEventListener("click", () => {
                    state.categorySort = option.value;
                    loadCategoryMemes(state.categoryTag || getDefaultTags()[0] || DEFAULT_SUBMIT_TAG, 1, option.value);
                });
                actions.appendChild(button);
            }
        });
    }

    async function loadCategoryMemes(tagValue, pageNum = 1, sort = state.categorySort) {
        const cleanTag = normalizeBarrageText(tagValue) || DEFAULT_SUBMIT_TAG;
        const safePageNum = Math.max(1, Number(pageNum) || 1);
        const safeSort = CATEGORY_SORT_OPTIONS.some(option => option.value === sort) ? sort : "latest";
        const label = getTagLabel(cleanTag);

        state.mode = "category";
        state.categoryTag = cleanTag;
        state.categoryPage = safePageNum;
        state.categorySort = safeSort;
        hideHotSection();
        renderModeTabs();
        renderCategorySortControls();
        setTableTitle(`${label}：加载中...`);
        state.table.innerHTML = "";

        try {
            const response = await apiRequest("GET", buildQueryPath(API_PATHS.PAGE_MEME, {
                tags: cleanTag,
                pageNum: safePageNum,
                pageSize: CATEGORY_PAGE_SIZE,
                sort: state.categorySort
            }));
            if (response?.code === 200 && response.data && Array.isArray(response.data.list)) {
                const total = Number(response.data.total) || 0;
                const rows = normalizeCategoryRows(response.data.list, cleanTag);
                const pageCount = getCategoryPageCount(total);
                state.categoryTotal = total;
                state.categoryRows = rows;
                setTableTitle(`${label}：共 ${total} 条；第 ${safePageNum}/${pageCount} 页；排序 ${CATEGORY_SORT_OPTIONS.find(option => option.value === state.categorySort)?.label || "最新"}（由后端返回）`);
                renderRows(rows, { emptyText: `${label} 暂无弹幕。` });
                renderCategoryPager(cleanTag, safePageNum, total);
                return;
            }
            setTableTitle(response?.msg || `${label} 加载失败`);
            renderRows([], { emptyText: response?.msg || `${label} 加载失败。` });
        } catch (error) {
            console.error("[dgq63136] 分类弹幕加载失败", error);
            setTableTitle(`${label} 加载失败，请稍后再试`);
            renderRows([], { emptyText: `${label} 加载失败，请稍后再试。` });
        }
    }

    async function searchMemes(keyword) {
        const value = normalizeBarrageText(keyword);
        if (!value) {
            showMsg("请输入搜索关键词", "warn");
            return;
        }
        state.mode = "search";
        hideHotSection();
        renderModeTabs();
        clearTitleActions();
        setTableTitle("搜索中...");
        state.table.innerHTML = "";
        try {
            const response = await apiRequest("POST", API_PATHS.QUERY_MEME, { D: "油猴", barrage: value });
            if (response?.code === 200 && Array.isArray(response.data)) {
                const rows = response.data.map(item => normalizeMemeRow(item, { source: "search" })).filter(item => item.content);
                state.searchRows = rows;
                setTableTitle(`搜索结果：${rows.length} 条；点击弹幕文本复制。`);
                renderRows(rows, { emptyText: "没有搜到，看到合适弹幕可以直接投稿。" });
                return;
            }
            setTableTitle(response?.msg || "搜索失败");
            renderRows([], { emptyText: response?.msg || "搜索失败" });
        } catch (error) {
            console.error("[dgq63136] 搜索失败", error);
            setTableTitle("搜索失败，请稍后再试");
            renderRows([], { emptyText: "搜索失败，请稍后再试" });
        }
    }

    function getFavoriteFilterOptions() {
        return [
            { label: "全部", value: "all" },
            ...getShortcutTags().map(tag => ({ label: tag.label, value: tag.value })),
            { label: "未分类", value: "uncategorized" }
        ];
    }

    function filterFavorites(favorites, filterTag) {
        if (filterTag === "all") return favorites;
        if (filterTag === "uncategorized") return favorites.filter(item => parseTags(item.tags).length === 0);
        return favorites.filter(item => parseTags(item.tags).includes(filterTag));
    }

    function renderFavoriteFilters() {
        setTitleActions(actions => {
            for (const option of getFavoriteFilterOptions()) {
                const button = document.createElement("button");
                button.className = "dgq-filter-btn";
                button.type = "button";
                button.textContent = option.label;
                button.classList.toggle("is-active", state.favoriteFilterTag === option.value);
                button.addEventListener("click", () => renderFavorites(1, option.value));
                actions.appendChild(button);
            }
        });
    }

    function renderFavorites(pageNum = state.favoritesPage, filterTag = state.favoriteFilterTag) {
        state.mode = "favorites";
        hideHotSection();
        renderModeTabs();
        state.favoriteFilterTag = filterTag || "all";
        state.favoritesPage = Math.max(1, Number(pageNum) || 1);
        const favorites = getFavorites();
        const filtered = filterFavorites(favorites, state.favoriteFilterTag);
        const pageCount = Math.max(1, Math.ceil(filtered.length / LIST_PAGE_SIZE));
        const safePage = Math.min(state.favoritesPage, pageCount);
        state.favoritesPage = safePage;
        const start = (safePage - 1) * LIST_PAGE_SIZE;
        const pageRows = filtered.slice(start, start + LIST_PAGE_SIZE).map(item => normalizeMemeRow({
            id: item.id,
            content: item.content,
            tags: item.tags,
            memeId: item.memeId,
            copyCount: item.copyCount,
            likes: item.likes,
            time: item.time || item.createdAt
        }, { source: "favorite" }));
        renderFavoriteFilters();
        setTableTitle(`本地收藏：${filtered.length}/${favorites.length} 条；只保存在当前浏览器/油猴插件里。`);
        renderRows(pageRows, {
            favoriteMode: true,
            emptyText: "本地收藏为空。点击斗鱼弹幕旁的“藏”即可收藏。",
            pager: {
                pageNum: safePage,
                pageCount,
                onPrev: () => renderFavorites(safePage - 1, state.favoriteFilterTag),
                onNext: () => renderFavorites(safePage + 1, state.favoriteFilterTag)
            }
        });
    }

    function renderRecents(pageNum = state.recentsPage) {
        state.mode = "recents";
        hideHotSection();
        renderModeTabs();
        clearTitleActions();
        const recents = getRecents();
        const pageCount = Math.max(1, Math.ceil(recents.length / LIST_PAGE_SIZE));
        const safePage = Math.min(Math.max(1, Number(pageNum) || 1), pageCount);
        state.recentsPage = safePage;
        const start = (safePage - 1) * LIST_PAGE_SIZE;
        const pageRows = recents.slice(start, start + LIST_PAGE_SIZE);
        setTableTitle(`最近使用：${recents.length} 条；复制、发送、投稿、收藏都会记录。`);
        renderRows(pageRows, {
            emptyText: "暂无最近使用记录。",
            pager: {
                pageNum: safePage,
                pageCount,
                onPrev: () => renderRecents(safePage - 1),
                onNext: () => renderRecents(safePage + 1)
            }
        });
    }

    function renderSettings() {
        state.mode = "settings";
        hideHotSection();
        renderModeTabs();
        clearTitleActions();
        const settings = getSettings();
        setTableTitle(`插件设置：当前版本 ${DISPLAY_VERSION}`);
        state.currentRows = [];
        state.table.innerHTML = "";

        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 2;
        const panel = document.createElement("div");
        panel.className = "dgq-settings-panel";

        const confirmRow = document.createElement("div");
        confirmRow.className = "dgq-setting-row";
        confirmRow.innerHTML = `<label><input type="checkbox" ${settings.confirmBeforeSend ? "checked" : ""}>发送前确认</label><span>默认关闭</span>`;
        confirmRow.querySelector("input").addEventListener("change", event => saveSettings({ confirmBeforeSend: event.target.checked }));
        panel.appendChild(confirmRow);

        const shortcutRow = document.createElement("div");
        shortcutRow.className = "dgq-setting-row";
        shortcutRow.innerHTML = `<label><input type="checkbox" ${settings.shortcutsEnabled ? "checked" : ""}>启用快捷键</label><span>Alt 组合键</span>`;
        shortcutRow.querySelector("input").addEventListener("change", event => saveSettings({ shortcutsEnabled: event.target.checked }));
        panel.appendChild(shortcutRow);

        const layoutRow = document.createElement("div");
        layoutRow.className = "dgq-setting-row";
        const layoutLabel = document.createElement("span");
        layoutLabel.textContent = "布局模式";
        layoutRow.appendChild(layoutLabel);

        const layoutToggle = document.createElement("div");
        layoutToggle.className = "dgq-layout-toggle";
        layoutRow.appendChild(layoutToggle);

        for (const option of [
            { label: "标准", value: "standard" },
            { label: "紧凑", value: "compact" }
        ]) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "dgq-layout-choice";
            button.textContent = option.label;
            button.dataset.value = option.value;
            button.classList.toggle("is-active", settings.layoutMode === option.value);
            button.addEventListener("click", () => {
                saveSettings({ layoutMode: option.value });
                renderSettings();
            });
            layoutToggle.appendChild(button);
        }
        panel.appendChild(layoutRow);

        const reviewBox = document.createElement("div");
        reviewBox.className = "dgq-review-setting";
        reviewBox.innerHTML = `
            <label>审核码<input class="dgq-reviewer-token" type="password" autocomplete="new-password" inputmode="text" placeholder="填写房管管理器生成的审核员 token"></label>
            <div class="dgq-review-setting-hint">审核码由房管管理器生成，备注姓名也在房管管理器里配置；这里不需要填写备注。</div>
            <div class="dgq-review-setting-hint dgq-review-token-status"></div>
            <div class="dgq-review-setting-actions">
                <button class="dgq-save-reviewer-token" type="button">保存审核码</button>
                <button class="dgq-clear-reviewer-token" type="button">清除审核码</button>
            </div>
        `;
        const tokenInput = reviewBox.querySelector(".dgq-reviewer-token");
        const tokenStatus = reviewBox.querySelector(".dgq-review-token-status");
        tokenStatus.textContent = settings.reviewerToken ? `已保存审核码：${maskSecret(settings.reviewerToken)}` : "未绑定审核码，点击“审”前需要先绑定。";
        reviewBox.querySelector(".dgq-save-reviewer-token").addEventListener("click", () => {
            const reviewerToken = String(tokenInput.value || "").trim() || settings.reviewerToken;
            if (!reviewerToken) {
                showMsg("请填写审核码", "warn");
                return;
            }
            saveSettings({ reviewerToken });
            showMsg("审核码已保存");
        });
        reviewBox.querySelector(".dgq-clear-reviewer-token").addEventListener("click", () => {
            saveSettings({ reviewerToken: "" });
            showMsg("审核码已清除");
        });
        panel.appendChild(reviewBox);

        const help = document.createElement("div");
        help.className = "dgq-shortcut-help";
        help.textContent = "快捷键：Alt+C 打开/关闭，Alt+S 聚焦搜索，Alt+Enter 发送第一条，Alt+←/→ 翻页，Alt+R 随机，Esc 关闭弹窗。";
        panel.appendChild(help);

        td.appendChild(panel);
        tr.appendChild(td);
        state.table.appendChild(tr);
    }

    async function requestBackendRandom(tagValue = "") {
        const response = await apiRequest("GET", buildQueryPath(API_PATHS.RANDOM_MEME, {
            tags: tagValue || undefined
        }));
        if (response?.code !== 200) throw new Error(response?.msg || "随机接口未返回成功");
        const data = Array.isArray(response.data) ? response.data[0] : response.data;
        const row = normalizeMemeRow(data || {}, {
            source: tagValue ? "category-random" : "random",
            tags: tagValue ? [tagValue] : undefined
        });
        if (!row.content) throw new Error("随机接口暂无弹幕");
        return row;
    }

    function getRandomPool() {
        if (state.mode === "category" && state.categoryRows.length) return state.categoryRows;
        if (state.mode === "hot" && state.hotCache[state.hotTab]?.length) return state.hotCache[state.hotTab];
        if (state.mode === "favorites") {
            return filterFavorites(getFavorites(), state.favoriteFilterTag).map(item => normalizeMemeRow({
                content: item.content,
                tags: item.tags,
                memeId: item.memeId,
                copyCount: item.copyCount,
                likes: item.likes,
                time: item.time
            }, { source: "favorite" }));
        }
        if (state.mode === "recents") return getRecents();
        return state.currentRows.length ? state.currentRows : state.searchRows;
    }

    async function pickRandomMeme() {
        let row = null;
        const tagForBackend = state.mode === "category" && state.categoryTag ? state.categoryTag : "";
        if (state.mode === "category" || state.mode === "search") {
            try {
                row = await requestBackendRandom(tagForBackend);
            } catch (error) {
                console.warn("[dgq63136] 后端随机接口不可用，尝试本地缓存", error);
            }
        }
        if (!row) {
            const pool = getRandomPool().filter(item => item.content);
            if (!pool.length) {
                showMsg(tagForBackend ? "当前分类暂无缓存，随机接口待接入或稍后再试" : "暂无可随机弹幕，请先搜索、打开分类、热榜、最近或收藏", "warn");
                return;
            }
            row = pool[Math.floor(Math.random() * pool.length)];
        }
        hideHotSection();
        clearTitleActions();
        setTableTitle("随机来一条：可直接发送、投稿或收藏。");
        renderRows([row], { emptyText: "随机失败，请稍后再试。" });
    }

    function closeSendConfirmDialog() {
        document.getElementById("dgq-send-confirm-mask")?.remove();
    }

    function openSendConfirmDialog(text, onConfirm) {
        closeSendConfirmDialog();
        const mask = document.createElement("div");
        mask.id = "dgq-send-confirm-mask";
        mask.className = "dgq-submit-dialog-mask";

        const dialog = document.createElement("div");
        dialog.className = "dgq-submit-dialog";
        mask.appendChild(dialog);

        const header = document.createElement("div");
        header.className = "dgq-submit-dialog-header";
        header.textContent = "确认发送弹幕";
        dialog.appendChild(header);

        const preview = document.createElement("div");
        preview.className = "dgq-submit-dialog-preview";
        preview.textContent = text;
        dialog.appendChild(preview);

        const actions = document.createElement("div");
        actions.className = "dgq-submit-dialog-actions";
        dialog.appendChild(actions);

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.className = "dgq-submit-cancel";
        cancelButton.textContent = "取消";
        cancelButton.addEventListener("click", closeSendConfirmDialog);
        actions.appendChild(cancelButton);

        const confirmButton = document.createElement("button");
        confirmButton.type = "button";
        confirmButton.className = "dgq-submit-confirm";
        confirmButton.textContent = "发送";
        confirmButton.addEventListener("click", () => {
            closeSendConfirmDialog();
            onConfirm();
        });
        actions.appendChild(confirmButton);

        mask.addEventListener("click", event => {
            if (event.target === mask) closeSendConfirmDialog();
        });
        dialog.addEventListener("click", event => event.stopPropagation());
        document.body.appendChild(mask);
    }

    function executeCurrentPager(direction) {
        const pagerButtonText = direction > 0 ? "下一页" : "上一页";
        const buttons = Array.from(state.table?.querySelectorAll(".dgq-category-page-btn") || []);
        const button = buttons.find(item => item.textContent === pagerButtonText && !item.disabled);
        if (button) {
            button.click();
            return true;
        }
        showMsg("当前没有可翻的页面", "warn");
        return false;
    }

    function sendFirstVisibleRow() {
        const row = state.currentRows.find(item => item.content);
        if (!row) {
            showMsg("当前列表没有可发送弹幕", "warn");
            return;
        }
        sendBarrage(row.content, row.meta);
    }

    function initKeyboardShortcuts() {
        if (window.__dgq63136ShortcutsBound) return;
        window.__dgq63136ShortcutsBound = true;
        document.addEventListener("keydown", event => {
            if (isExternalPluginNode(event.target)) return;
            const dialogOpen = document.getElementById("dgq-submit-dialog-mask") || document.getElementById("dgq-send-confirm-mask");
            if (event.key === "Escape" && dialogOpen) {
                event.preventDefault();
                document.getElementById("dgq-submit-dialog-mask")?.remove();
                closeSendConfirmDialog();
                return;
            }
            if (!event.altKey || !getSettings().shortcutsEnabled) return;
            const key = event.key.toLowerCase();
            if (key === "c") {
                event.preventDefault();
                togglePanel();
            } else if (key === "s") {
                event.preventDefault();
                togglePanel(true);
                state.searchInput?.focus();
            } else if (event.key === "Enter") {
                event.preventDefault();
                sendFirstVisibleRow();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                executeCurrentPager(1);
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                executeCurrentPager(-1);
            } else if (key === "r") {
                event.preventDefault();
                pickRandomMeme();
            }
        });
    }

    function formatDisplayVersion(version) {
        const clean = String(version || "").trim();
        if (!clean) return "";
        const withoutPrefix = clean.replace(/^v/i, "");
        const mapped = LEGACY_VERSION_MAP[withoutPrefix] || withoutPrefix;
        return /^v/i.test(mapped) ? mapped.toUpperCase() : `V${mapped}`;
    }

    function getKnownChangelog(version) {
        return CHANGELOG[formatDisplayVersion(version)] || ["打开一键安装页查看完整更新历史。"];
    }

    function normalizeRemoteVersionInfo(input) {
        if (!input) return null;
        if (typeof input === "string") {
            const version = input.trim();
            return version ? { version, displayVersion: formatDisplayVersion(version) } : null;
        }
        if (typeof input !== "object") return null;
        const version = String(input.version || "").trim();
        if (!version) return null;
        const displayVersion = String(input.displayVersion || "").trim() || formatDisplayVersion(version);
        return { version, displayVersion };
    }

    function renderUpdateCard() {
        if (!state.updateCardEl) return;
        const latest = state.updateLatestVersion || CURRENT_VERSION;
        const latestDisplay = state.updateLatestDisplayVersion || formatDisplayVersion(latest);
        const changes = CHANGELOG[latestDisplay] || getKnownChangelog(latest);
        state.updateCardEl.innerHTML = "";

        const summary = document.createElement("div");
        summary.innerHTML = `当前版本：<strong>${DISPLAY_VERSION}</strong>　最新版本：<strong>${latestDisplay}</strong>`;
        state.updateCardEl.appendChild(summary);

        const list = document.createElement("ul");
        for (const change of changes) {
            const item = document.createElement("li");
            item.textContent = change;
            list.appendChild(item);
        }
        state.updateCardEl.appendChild(list);

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "去一键安装页";
        button.addEventListener("click", () => openExternalUrl(UPDATE_PAGE_URL));
        state.updateCardEl.appendChild(button);
        state.updateCardEl.classList.toggle("is-visible", state.updateCardVisible);
    }

    function toggleUpdateCard(force) {
        state.updateCardVisible = force === undefined ? !state.updateCardVisible : Boolean(force);
        renderUpdateCard();
    }

    function readUpdateCache() {
        const cache = storageGet(UPDATE_CACHE_KEY, null);
        const normalizedCache = normalizeRemoteVersionInfo(cache);
        if (!normalizedCache || typeof cache !== "object") return null;
        if (!cache.version || !Number.isFinite(Number(cache.checkedAt))) return null;
        return {
            version: normalizedCache.version,
            displayVersion: normalizedCache.displayVersion,
            checkedAt: Number(cache.checkedAt)
        };
    }

    function writeUpdateCache(versionInfo) {
        const normalized = normalizeRemoteVersionInfo(versionInfo);
        if (!normalized) return;
        storageSet(UPDATE_CACHE_KEY, {
            version: normalized.version,
            displayVersion: normalized.displayVersion,
            checkedAt: Date.now()
        });
    }

    function requestLatestVersion(options = {}) {
        const force = Boolean(options.force);
        const cache = readUpdateCache();
        if (!force && cache && Date.now() - cache.checkedAt < AUTO_UPDATE_CHECK_INTERVAL) {
            return Promise.resolve(cache);
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `${UPDATE_SOURCE_URL}?_=${Date.now()}`,
                responseType: "text",
                onload(response) {
                    if (response.status !== 200) {
                        reject(new Error(`status ${response.status}`));
                        return;
                    }
                    const text = response.responseText || response.response || "";
                    const versionMatch = text.match(/@version\s+([^\s\n\r]+)/);
                    const displayMatch = text.match(/DISPLAY_VERSION\s*=\s*["'](V\d+\.\d+\.\d+)["']/);
                    const latestVersion = versionMatch?.[1]?.trim();
                    if (!latestVersion) {
                        reject(new Error("missing version"));
                        return;
                    }
                    const latestVersionInfo = {
                        version: latestVersion,
                        displayVersion: displayMatch?.[1]?.trim() || formatDisplayVersion(latestVersion)
                    };
                    writeUpdateCache(latestVersionInfo);
                    resolve(latestVersionInfo);
                },
                onerror(error) {
                    reject(error);
                }
            });
        });
    }

    function openUpdateDialog(options = {}) {
        ensurePanelBootstrapped({ lightweight: true });
        document.getElementById("dgq-update-dialog-mask")?.remove();
        const mask = document.createElement("div");
        mask.id = "dgq-update-dialog-mask";
        mask.innerHTML = `
            <div class="dgq-update-dialog" role="dialog" aria-modal="true" aria-label="检测插件更新">
                <div class="dgq-update-dialog-header">
                    <strong>插件更新检测</strong>
                    <button class="dgq-update-dialog-close" type="button" aria-label="关闭">x</button>
                </div>
                <div class="dgq-update-dialog-body">
                    <div class="dgq-update-dialog-status">正在检测最新版本...</div>
                    <div class="dgq-update-dialog-versions">当前版本：${DISPLAY_VERSION}<br>最新版本：检测中</div>
                </div>
                <div class="dgq-update-dialog-actions">
                    <button class="dgq-update-dialog-update" type="button" disabled>更新</button>
                    <button class="dgq-update-dialog-visit" type="button">访问</button>
                </div>
            </div>
        `;
        document.body.appendChild(mask);
        const close = () => mask.remove();
        const status = mask.querySelector(".dgq-update-dialog-status");
        const versions = mask.querySelector(".dgq-update-dialog-versions");
        const updateButton = mask.querySelector(".dgq-update-dialog-update");
        const visitButton = mask.querySelector(".dgq-update-dialog-visit");
        mask.querySelector(".dgq-update-dialog-close")?.addEventListener("click", close);
        mask.addEventListener("click", event => {
            if (event.target === mask) close();
        });
        visitButton?.addEventListener("click", () => openExternalUrl(UPDATE_PAGE_URL));
        updateButton?.addEventListener("click", () => {
            if (updateButton.disabled) return;
            openExternalUrl(UPDATE_SCRIPT_URL);
        });

        const latestVersionInfo = normalizeRemoteVersionInfo(options.latestVersionInfo || options.latestVersion);
        const latestVersionPromise = latestVersionInfo
            ? Promise.resolve(latestVersionInfo)
            : requestLatestVersion({ force: true });

        latestVersionPromise
            .then(remoteInfo => {
                const latestInfo = normalizeRemoteVersionInfo(remoteInfo);
                if (!latestInfo) throw new Error("missing version");
                const latestDisplay = latestInfo.displayVersion;
                const hasUpdate = hasDisplayVersionUpdate(latestInfo) || compareVersions(latestInfo.version, CURRENT_VERSION) > 0;
                state.updateLatestVersion = latestInfo.version;
                state.updateLatestDisplayVersion = latestInfo.displayVersion;
                if (versions) versions.innerHTML = `当前版本：${DISPLAY_VERSION}<br>最新版本：${latestDisplay}`;
                if (status) {
                    status.textContent = hasUpdate ? `检测到新版本 ${latestDisplay}` : "当前已是最新版本";
                    status.style.color = hasUpdate ? "#d35400" : "#2e7d32";
                }
                if (updateButton) {
                    updateButton.disabled = !hasUpdate;
                    updateButton.title = hasUpdate ? "打开脚本安装页更新" : "当前已是最新版本，无需更新";
                }
                if (hasUpdate) {
                    setUpdateTip(latestInfo);
                }
            })
            .catch(error => {
                console.error("[dgq63136] 更新检查失败", error);
                if (status) {
                    status.textContent = "更新检测失败，请稍后重试";
                    status.style.color = "#d9534f";
                }
                if (versions) versions.innerHTML = `当前版本：${DISPLAY_VERSION}<br>最新版本：检测失败`;
                if (updateButton) {
                    updateButton.disabled = true;
                    updateButton.title = "检测失败，暂时不能更新";
                }
            });
    }

    function checkUpdateOnPanelOpen() {
        if (state.autoUpdatePromptChecked) return;
        state.autoUpdatePromptChecked = true;
        requestLatestVersion()
            .then(latestVersionInfo => {
                const latestInfo = normalizeRemoteVersionInfo(latestVersionInfo);
                if (!latestInfo || compareVersions(latestInfo.version, CURRENT_VERSION) <= 0) return;
                setUpdateTip(latestInfo);
                if (state.autoUpdateDialogShown) return;
                state.autoUpdateDialogShown = true;
                openUpdateDialog({ latestVersionInfo: latestInfo });
            })
            .catch(error => {
                console.warn("[dgq63136] 自动更新检查失败", error);
            });
    }

    function ensurePanelBootstrapped(options = {}) {
        createMainPanel();
        if (state.panelBootstrapped) return;
        state.panelBootstrapped = true;
        loadTagOptions();
        if (!options.lightweight) {
            checkUpdateOnPanelOpen();
            initGFWebSocket();
        }
    }

    function togglePanel(visible) {
        const panel = createMainPanel();
        if (!panel) return;
        state.panelVisible = visible === undefined ? panel.style.display === "none" : visible;
        panel.style.display = state.panelVisible ? "flex" : "none";
        if (state.panelVisible) ensurePanelBootstrapped();
    }

    function insertToolbarToggleButton() {
        let toolbar = document.querySelector(".ChatToolBar__right");
        if (!toolbar) {
            const now = Date.now();
            if (now - state.lastDeepToolbarSearchAt < 5000) return;
            state.lastDeepToolbarSearchAt = now;
            toolbar = querySelectorDeep(".ChatToolBar__right");
        }
        if (!toolbar || toolbar.querySelector("#meme-btn-id-dgq")) return;
        const button = document.createElement("button");
        button.id = "meme-btn-id-dgq";
        button.type = "button";
        button.textContent = "厕纸";
        button.title = "打开63136烂梗面板";
        button.addEventListener("click", () => togglePanel());
        toolbar.insertBefore(button, toolbar.firstChild);
    }

    function getLiveVideoNode() {
        const preferredVideo = document.querySelector(".layout-Player-videoEntity video");
        if (preferredVideo) return preferredVideo;
        return Array.from(document.querySelectorAll(LIVE_VIDEO_SELECTOR)).find(video => {
            const rect = video.getBoundingClientRect();
            return rect.width > 160 && rect.height > 90 && video.buffered !== undefined;
        }) || null;
    }

    function syncLiveVideoTime() {
        const video = getLiveVideoNode();
        const buffered = video?.buffered;
        if (!video || !buffered || buffered.length === 0) {
            showMsg("暂无可同步的直播时间", "warn");
            return;
        }
        const targetTime = buffered.end(buffered.length - 1);
        try {
            video.currentTime = targetTime;
        } catch (error) {
            video.currentTime = Math.max(0, targetTime - 0.05);
        }
        showMsg("已同步到最新直播时间");
    }

    function createVideoSyncButton() {
        const button = document.createElement("div");
        button.id = VIDEO_SYNC_BUTTON_ID;
        button.title = "同步时间";
        button.setAttribute("role", "button");
        button.setAttribute("tabindex", "0");
        button.innerHTML = `
            <svg viewBox="0 0 1024 1024" aria-hidden="true">
                <path d="M938.1888 534.016h-80.7936c0.4096-7.3728 0.6144-14.6432 0.6144-22.016 0-218.624-176.8448-400.7936-389.12-400.7936C257.024 111.2064 80.6912 293.1712 80.6912 512c0 218.7264 176.4352 400.7936 388.1984 400.7936 74.752 0 149.0944-22.016 208.1792-60.0064l42.7008 68.608c-75.0592 48.9472-161.9968 74.8544-250.7776 74.752C209.8176 996.1472 0 779.264 0 512S209.8176 27.8528 468.8896 27.8528C728.3712 27.8528 938.7008 244.736 938.7008 512c0 7.3728-0.2048 14.6432-0.512 22.016z m-261.12 318.7712z m-26.4192-158.1056L426.7008 556.032V291.9424h64v226.5088L689.5616 635.904l-38.912 58.7776z m245.3504-6.656L768 512h256L896 688.0256z" fill="currentColor"></path>
            </svg>
        `;
        const handleActivate = event => {
            event.preventDefault();
            event.stopPropagation();
            syncLiveVideoTime();
        };
        button.addEventListener("click", handleActivate);
        button.addEventListener("keydown", event => {
            if (event.key !== "Enter" && event.key !== " ") return;
            handleActivate(event);
        });
        return button;
    }

    function ensureVideoSyncButton() {
        const ownButton = document.getElementById(VIDEO_SYNC_BUTTON_ID);
        if (document.getElementById(DOUYUEX_VIDEO_SYNC_BUTTON_ID)) {
            ownButton?.remove();
            return;
        }
        if (ownButton?.isConnected) return;
        const toolbar = document.querySelector(VIDEO_SYNC_TOOLBAR_SELECTOR);
        if (!toolbar || isExternalPluginNode(toolbar)) return;
        const button = createVideoSyncButton();
        const isCompactToolbar = toolbar.classList.contains("left-bfab3b");
        if (isCompactToolbar) button.classList.add("dgq-video-sync-compact");
        const targetIndex = isCompactToolbar ? 2 : 3;
        toolbar.insertBefore(button, toolbar.childNodes[targetIndex] || null);
    }

    function initVideoSyncButton() {
        if (state.videoSyncStarted) return;
        state.videoSyncStarted = true;
        ensureVideoSyncButton();
    }

    function isLikelyPlayerGiftPopup(element) {
        if (!element || element.nodeType !== 1) return false;
        if (element.closest("#dgq63136-panel, #dgq-submit-dialog-mask, #dgq-send-confirm-mask, #dgq-update-dialog-mask") || isExternalPluginNode(element)) return false;
        if (element.closest("#js-player-toolbar, #js-player-controlbar, .ChatSend, .Barrage-list, [class*='Barrage-list']")) return false;
        const text = normalizeBarrageText(element.textContent || "");
        if (!text || !/灯塔/.test(text)) return false;
        if (!/(点亮全站第\d+层灯塔|助力.*灯塔|赠送.*灯塔|去看看)/.test(text)) return false;
        const rect = element.getBoundingClientRect();
        if (rect.width < 120 || rect.width > 560 || rect.height < 24 || rect.height > 180) return false;
        const playerRoot = element.closest(PLAYER_GIFT_POPUP_ROOT_SELECTOR);
        if (!playerRoot) return false;
        const rootRect = playerRoot.getBoundingClientRect();
        if (rootRect.width > 0 && rect.width > rootRect.width * 0.75) return false;
        if (rootRect.height > 0 && rect.height > rootRect.height * 0.35) return false;
        return true;
    }

    function hidePlayerGiftPopup(element) {
        if (!isLikelyPlayerGiftPopup(element)) return false;
        element.setAttribute(PLAYER_GIFT_POPUP_HIDDEN_ATTRIBUTE, "1");
        return true;
    }

    function scanPlayerGiftPopupNode(node) {
        if (!node || node.nodeType !== 1) return;
        if (hidePlayerGiftPopup(node)) return;
        node.querySelectorAll("div, section, aside, a, button").forEach(element => {
            hidePlayerGiftPopup(element);
        });
    }

    function getPlayerGiftPopupRoots() {
        return Array.from(document.querySelectorAll(PLAYER_GIFT_POPUP_ROOT_SELECTOR))
            .filter(root => root?.isConnected && !isExternalPluginNode(root));
    }

    function initPlayerGiftPopupBlocker() {
        if (state.playerGiftPopupBlockerStarted) return;
        state.playerGiftPopupBlockerStarted = true;
        const observedRoots = new Map();
        let scheduledNodes = new Set();
        let scheduled = false;

        const flushNodes = () => {
            scheduled = false;
            const nodes = Array.from(scheduledNodes);
            scheduledNodes = new Set();
            nodes.forEach(scanPlayerGiftPopupNode);
        };

        const scheduleNode = node => {
            if (!node || node.nodeType !== 1) return;
            scheduledNodes.add(node);
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(flushNodes);
        };

        const syncRoots = () => {
            getPlayerGiftPopupRoots().forEach(root => {
                if (!observedRoots.has(root)) {
                    const observer = new MutationObserver(mutations => {
                        mutations.forEach(mutation => {
                            mutation.addedNodes.forEach(scheduleNode);
                        });
                    });
                    observer.observe(root, { childList: true, subtree: true });
                    observedRoots.set(root, observer);
                    scheduleNode(root);
                }
            });
            observedRoots.forEach((observer, root) => {
                if (root.isConnected) return;
                observer.disconnect();
                observedRoots.delete(root);
            });
        };

        const discoverTimer = setInterval(syncRoots, 2000);
        syncRoots();
        window.addEventListener("beforeunload", () => {
            clearInterval(discoverTimer);
            observedRoots.forEach(observer => observer.disconnect());
            observedRoots.clear();
            scheduledNodes.clear();
        });
    }

    function enableDrag(container, handle) {
        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;
        handle.addEventListener("pointerdown", event => {
            if (event.button !== undefined && event.button !== 0) return;
            if (event.target.closest("button, select, input, svg, path")) return;
            dragging = true;
            const rect = container.getBoundingClientRect();
            offsetX = event.clientX - rect.left;
            offsetY = event.clientY - rect.top;
            handle.setPointerCapture(event.pointerId);
            event.preventDefault();
        });
        handle.addEventListener("pointermove", event => {
            if (!dragging) return;
            container.style.left = `${event.clientX - offsetX}px`;
            container.style.top = `${event.clientY - offsetY}px`;
            container.style.right = "auto";
        });
        const end = () => {
            dragging = false;
        };
        handle.addEventListener("pointerup", end);
        handle.addEventListener("pointercancel", end);
    }

    function getRoomId() {
        const match = location.pathname.match(/\/(?:room\/)?(\d+)/);
        return match ? match[1] : "";
    }

    function isNonChatBarrageText(text) {
        const clean = normalizeBarrageText(text);
        if (!clean) return true;
        const blockedPatterns = [
            /欢迎来到/,
            /斗鱼严禁/,
            /未成年人直播或打赏/,
            /网络赌博/,
            /谨防网络诈骗/,
            /^看点[:：]/,
            /^标题[:：]/,
            /^主播[:：]/,
            /^系统[:：]/,
            /^公告[:：]/,
            /^提示[:：]/
        ];
        return blockedPatterns.some(pattern => pattern.test(clean));
    }

    function parseBarrageTextFromFullLine(text) {
        const clean = normalizeBarrageText(text);
        if (!clean || isNonChatBarrageText(clean)) return "";
        const match = clean.match(/([^：:]{1,30})[：:]\s*(.+)$/);
        if (!match) return "";
        const author = normalizeBarrageText(match[1]);
        const content = normalizeBarrageText(match[2]);
        if (!author || !content || isNonChatBarrageText(author) || isNonChatBarrageText(content)) return "";
        if (/^(看点|标题|主播|系统|公告|提示)$/u.test(author)) return "";
        return content;
    }

    function getBarrageTextElementFromItem(item) {
        const selectors = [
            ".Barrage-content .Barrage-text",
            "[class*='Barrage-content'] [class*='Barrage-text']",
            ".Barrage-text",
            "[class*='Barrage-text']",
            "[class*='danmuContent']"
        ];
        for (const selector of selectors) {
            const element = item.querySelector(selector);
            if (element) return element;
        }
        return null;
    }

    function getTextWithoutBarrageActions(node) {
        if (!node) return "";
        const clone = node.cloneNode(true);
        clone.querySelectorAll(".dgq-barrage-actions").forEach(element => element.remove());
        return normalizeBarrageText(clone.textContent || "");
    }

    function getBarrageTextFromItem(item) {
        const textElement = getBarrageTextElementFromItem(item);
        const directText = getTextWithoutBarrageActions(textElement);
        if (directText && !isNonChatBarrageText(directText)) return directText;
        return parseBarrageTextFromFullLine(getTextWithoutBarrageActions(item));
    }

    function isOrdinaryBarrageItem(item) {
        if (!item || item.closest("#dgq63136-panel, #dgq-submit-dialog-mask, #dgq-send-confirm-mask, #dgq-update-dialog-mask") || isExternalPluginNode(item)) return false;
        const classText = String(item.className || "").toLowerCase();
        if (/(notice|system|announce|announcement|welcome|recommend|card|rank|gift|guard)/.test(classText)) return false;
        const fullText = getTextWithoutBarrageActions(item);
        if (!fullText || isNonChatBarrageText(fullText)) return false;
        const hasAuthor = Boolean(item.querySelector("[class*='nick'], [class*='Nick'], [class*='name'], [class*='Name'], [class*='author'], [class*='Author']"));
        const hasColonLine = Boolean(parseBarrageTextFromFullLine(fullText));
        const text = getBarrageTextFromItem(item);
        return Boolean(text && (hasAuthor || hasColonLine));
    }

    function appendBarrageActions(item, actions) {
        const textElement = getBarrageTextElementFromItem(item);
        if (textElement?.parentElement) {
            textElement.parentElement.insertBefore(actions, textElement.nextSibling);
            return;
        }
        const content = item.querySelector(".Barrage-content, [class*='Barrage-content']");
        if (content) {
            content.appendChild(actions);
            return;
        }
        item.appendChild(actions);
    }

    function collectBarrageItemsFromNode(node, bucket) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE || !bucket) return;
        if (node.matches?.(BARRAGE_ITEM_SELECTOR)) bucket.add(node);
        node.querySelectorAll?.(BARRAGE_ITEM_SELECTOR).forEach(item => bucket.add(item));
    }

    function enhanceBarrageItem(item) {
        if (!item || item.querySelector(".dgq-barrage-actions")) return;
        if (!isOrdinaryBarrageItem(item)) return;
        const text = getBarrageTextFromItem(item);
        if (!text) return;
        item.classList.add("dgq-barrage-enhanced");

        const actions = document.createElement("span");
        actions.className = "dgq-barrage-actions";

        const submitButton = document.createElement("button");
        submitButton.className = "dgq-barrage-action-btn dgq-barrage-action-submit";
        submitButton.type = "button";
        submitButton.textContent = "投";
        submitButton.title = "投稿到63136";
        submitButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            openSubmitTagDialog(getBarrageTextFromItem(item) || text, { source: "barrage-list" });
        });
        actions.appendChild(submitButton);

        const plusButton = document.createElement("button");
        plusButton.className = "dgq-barrage-action-btn dgq-barrage-action-plus";
        plusButton.type = "button";
        plusButton.textContent = "+1";
        plusButton.title = "复读这条弹幕";
        plusButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            sendBarrage(getBarrageTextFromItem(item) || text, { source: "barrage-list-plus" });
        });
        actions.appendChild(plusButton);

        if (isReviewEnabled()) {
            const reviewButton = document.createElement("button");
            reviewButton.className = "dgq-barrage-action-btn dgq-barrage-action-review";
            reviewButton.type = "button";
            reviewButton.textContent = "审";
            reviewButton.title = "提交到房管弹幕管理器待审";
            reviewButton.addEventListener("click", async event => {
                event.preventDefault();
                event.stopPropagation();
                reviewButton.disabled = true;
                reviewButton.textContent = "审...";
                const ok = await reportBarrageReview(getBarrageTextFromItem(item) || text, {
                    source: "barrage-list-review",
                    roomId: getRoomId(),
                    senderUid: getBarrageSenderUid(item),
                    senderName: getBarrageSenderName(item)
                });
                reviewButton.textContent = ok ? "已审" : "审";
                if (!ok) reviewButton.disabled = false;
            });
            actions.appendChild(reviewButton);
        }

        appendBarrageActions(item, actions);
    }

    function getBarrageObserverRoots() {
        const roots = new Set();
        document.querySelectorAll(BARRAGE_LIST_ROOT_SELECTOR).forEach(element => {
            if (!element.closest("#dgq63136-panel, #dgq-submit-dialog-mask, #dgq-send-confirm-mask, #dgq-update-dialog-mask") && !isExternalPluginNode(element)) {
                roots.add(element);
            }
        });
        return [...roots].filter(root => root?.isConnected);
    }

    function getBarragePanelText(panel) {
        const selectors = [
            ".danmuContent-25f266",
            "[class*='danmuContent']",
            ".Barrage-text",
            "[class*='Barrage-text']"
        ];
        for (const selector of selectors) {
            const element = panel.querySelector(selector);
            const text = normalizeBarrageText(element?.textContent || "");
            if (text) return text;
        }
        return "";
    }

    function getBarragePanelAuthor(panel) {
        const author = panel.querySelector(".danmuAuthor-3d7b4a, [class*='danmuAuthor']");
        return normalizeBarrageText(author?.textContent || "");
    }

    function getBarrageTipText() {
        const higherContainer = document.getElementById("comment-higher-container");
        if (higherContainer) {
            const textDom = higherContainer.querySelector(".text-879f3e, [class*='text']");
            const text = normalizeBarrageText(textDom?.textContent || higherContainer.textContent || "");
            if (text) return text;
        }
        const panel = document.querySelector(".danmudiv-32f498, [class*='danmudiv']");
        return panel ? getBarragePanelText(panel) : "";
    }

    function getBarrageTipButtonParent() {
        const douyuExPlusButton = document.querySelector('[id="barrage-panel-tip__+1"]');
        if (douyuExPlusButton?.parentElement) {
            return { parent: douyuExPlusButton.parentElement, douyuExPlusButton };
        }
        const ownPlusButton = document.getElementById("dgq-panel-plus-one");
        if (ownPlusButton?.parentElement) {
            return { parent: ownPlusButton.parentElement, douyuExPlusButton: null };
        }
        const firstLabel = document.querySelector(".labelfisrt-407af4");
        if (firstLabel?.parentElement) {
            return { parent: firstLabel.parentElement, douyuExPlusButton: null };
        }
        return { parent: null, douyuExPlusButton: null };
    }

    function removeLegacyPanelButtons() {
        document.querySelectorAll("#dgq-panel-favorite").forEach(button => button.remove());
        document.querySelectorAll("#dgq-panel-submit").forEach(button => {
            if (!button.classList.contains("dgq-panel-tip-submit")) {
                button.remove();
            }
        });
    }

    function setClassNameIfChanged(element, className) {
        if (element.className !== className) element.className = className;
    }

    function setTextIfChanged(element, text) {
        if (element.textContent !== text) element.textContent = text;
    }

    function setAttributeIfChanged(element, name, value) {
        if (element.getAttribute(name) !== value) element.setAttribute(name, value);
    }

    function stopPanelButtonEvent(event, preventDefault = false) {
        if (preventDefault) event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
    }

    function activatePanelButtonAction(button, event) {
        stopPanelButtonEvent(event, true);
        const now = Date.now();
        if (now - Number(button.__dgqPanelActionAt || 0) < 450) return;
        button.__dgqPanelActionAt = now;
        if (typeof button.__dgqPanelAction === "function") button.__dgqPanelAction(event);
    }

    function getPanelActionButtonFromEvent(event) {
        const path = typeof event.composedPath === "function" ? event.composedPath() : [event.target];
        for (const node of path) {
            if (!node || node.nodeType !== 1) continue;
            if (node.matches?.(PANEL_ACTION_SELECTOR)) return node;
            const button = node.closest?.(PANEL_ACTION_SELECTOR);
            if (button) return button;
        }
        return null;
    }

    function initPanelButtonActionCapture() {
        if (state.panelActionCaptureStarted) return;
        state.panelActionCaptureStarted = true;

        const handlePanelActionPointer = event => {
            const button = getPanelActionButtonFromEvent(event);
            if (!button?.__dgqPanelActionBound) return;
            activatePanelButtonAction(button, event);
        };

        // Register in the page realm first so the Douyu detail popup cannot consume the action at a parent node.
        const captureWindows = [window];
        if (typeof unsafeWindow !== "undefined" && unsafeWindow && unsafeWindow !== window) {
            captureWindows.unshift(unsafeWindow);
        }
        captureWindows.forEach(targetWindow => {
            targetWindow.addEventListener("pointerdown", handlePanelActionPointer, true);
            targetWindow.addEventListener("mousedown", handlePanelActionPointer, true);
            targetWindow.addEventListener("touchstart", handlePanelActionPointer, true);
        });
    }

    function bindPanelButtonAction(button, action) {
        button.__dgqPanelAction = action;
        if (button.__dgqPanelActionBound) return;
        button.__dgqPanelActionBound = true;
        button.addEventListener("click", event => {
            activatePanelButtonAction(button, event);
        }, true);
        button.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") activatePanelButtonAction(button, event);
        }, true);
    }

    function ensurePanelPlusOneButton(parent, douyuExPlusButton, text) {
        document.querySelectorAll("#dgq-panel-plus-one").forEach(button => {
            if (douyuExPlusButton || button.parentElement !== parent) {
                button.remove();
            }
        });

        if (douyuExPlusButton) return douyuExPlusButton;

        let button = parent.querySelector("#dgq-panel-plus-one");
        if (!button) {
            button = document.createElement("div");
            button.id = "dgq-panel-plus-one";
            parent.appendChild(button);
        }

        setClassNameIfChanged(button, "labelfisrt-407af4 thirdBtn-06cde5 fourBtn-0845d4 dgq-panel-plus-one");
        setTextIfChanged(button, "+1");
        setAttributeIfChanged(button, "title", "复读这条弹幕");
        setAttributeIfChanged(button, "role", "button");
        setAttributeIfChanged(button, "tabindex", "0");
        button.onclick = null;
        bindPanelButtonAction(button, () => {
            sendBarrage(getBarrageTipText() || text, { source: "panel-tip" });
        });
        return button;
    }

    function ensurePanelTipButtons() {
        removeLegacyPanelButtons();
        const text = getBarrageTipText();
        if (!text) return;

        const { parent, douyuExPlusButton } = getBarrageTipButtonParent();
        if (!parent) return;
        const plusButton = ensurePanelPlusOneButton(parent, douyuExPlusButton, text);

        parent.querySelector("#dgq-panel-review")?.remove();

        let button = parent.querySelector("#dgq-panel-submit");
        if (!button) {
            button = document.createElement("div");
            button.id = "dgq-panel-submit";
            parent.insertBefore(button, plusButton || null);
        } else if (plusButton && button.nextSibling !== plusButton) {
            parent.insertBefore(button, plusButton);
        }

        const baseClass = (plusButton?.className || "labelfisrt-407af4 thirdBtn-06cde5 fourBtn-0845d4")
            .replace(/\bdgq-panel-plus-one\b/g, "")
            .trim();
        setClassNameIfChanged(button, `${baseClass} dgq-panel-tip-submit`);
        setTextIfChanged(button, "投");
        setAttributeIfChanged(button, "title", "选择标签投稿到63136烂梗网站");
        setAttributeIfChanged(button, "role", "button");
        setAttributeIfChanged(button, "tabindex", "0");
        button.onclick = null;
        bindPanelButtonAction(button, () => {
            openSubmitTagDialog(getBarrageTipText() || text, { source: "panel-tip" });
        });
    }

    function enhanceBarragePanel() {
        if (document.querySelector("#xy-gift-recorder:hover")) return;
        if (!document.querySelector(".danmuTips-1ee820, #comment-higher-container, [id='barrage-panel-tip__+1'], .danmudiv-32f498, [class*='danmudiv']")) return;
        ensurePanelTipButtons();
    }

    function getBarragePanelObserverRoots() {
        const roots = [];
        document.querySelectorAll(BARRAGE_PANEL_ROOT_SELECTOR).forEach(root => roots.push(root));
        const panelRoot = document.querySelector(".danmuTips-1ee820")?.parentElement;
        if (panelRoot) roots.push(panelRoot);
        return [...new Set(roots)].filter(root => root?.isConnected && !isExternalPluginNode(root));
    }

    function initBarrageActions() {
        if (state.barrageActionsStarted) return;
        state.barrageActionsStarted = true;
        let barragePanelScheduled = false;
        let barrageListScheduled = false;
        const observedRoots = new Set();
        const observedPanelRoots = new Set();
        const observedListObservers = new Map();
        const pendingBarrageItems = new Set();

        function handleBarrageListPointer(event) {
            if (isExternalPluginNode(event.target)) return;
            const item = event.target?.closest?.(BARRAGE_ITEM_SELECTOR);
            if (item && event.currentTarget.contains(item)) {
                enhanceBarrageItem(item);
                scheduleBarragePanelEnhancement();
            }
        }

        const scheduleBarrageListEnhancement = () => {
            if (barrageListScheduled) return;
            barrageListScheduled = true;
            requestAnimationFrame(() => {
                barrageListScheduled = false;
                const items = Array.from(pendingBarrageItems);
                pendingBarrageItems.clear();
                items.forEach(item => enhanceBarrageItem(item));
            });
        };

        const syncBarrageListDelegates = () => {
            const roots = getBarrageObserverRoots();
            roots.forEach(root => {
                let shouldScanExistingItems = false;
                if (!observedRoots.has(root)) {
                    root.addEventListener("mouseover", handleBarrageListPointer);
                    root.addEventListener("focusin", handleBarrageListPointer);
                    observedRoots.add(root);
                    shouldScanExistingItems = true;
                }
                if (!observedListObservers.has(root)) {
                    const listObserver = new MutationObserver(mutations => {
                        let changed = false;
                        for (const mutation of mutations) {
                            mutation.addedNodes.forEach(node => {
                                const before = pendingBarrageItems.size;
                                collectBarrageItemsFromNode(node, pendingBarrageItems);
                                if (pendingBarrageItems.size > before) changed = true;
                            });
                        }
                        if (changed) scheduleBarrageListEnhancement();
                    });
                    listObserver.observe(root, { childList: true, subtree: true });
                    observedListObservers.set(root, listObserver);
                }
                if (shouldScanExistingItems) collectBarrageItemsFromNode(root, pendingBarrageItems);
            });
            observedRoots.forEach(root => {
                if (!root.isConnected) observedRoots.delete(root);
            });
            observedListObservers.forEach((observer, root) => {
                if (!root.isConnected) {
                    observer.disconnect();
                    observedListObservers.delete(root);
                }
            });
            if (pendingBarrageItems.size) scheduleBarrageListEnhancement();
        };

        const cleanupBarrageListDelegates = () => {
            observedRoots.forEach(root => {
                root.removeEventListener("mouseover", handleBarrageListPointer);
                root.removeEventListener("focusin", handleBarrageListPointer);
            });
            observedRoots.clear();
            observedListObservers.forEach(observer => observer.disconnect());
            observedListObservers.clear();
            pendingBarrageItems.clear();
        };

        const syncPanelObservers = () => {
            getBarragePanelObserverRoots().forEach(root => {
                if (observedPanelRoots.has(root)) return;
                panelObserver.observe(root, { childList: true, subtree: true });
                observedPanelRoots.add(root);
            });
            observedPanelRoots.forEach(root => {
                if (!root.isConnected) observedPanelRoots.delete(root);
            });
        };

        const scheduleBarragePanelEnhancement = () => {
            if (barragePanelScheduled) return;
            barragePanelScheduled = true;
            requestAnimationFrame(() => {
                barragePanelScheduled = false;
                syncPanelObservers();
                enhanceBarragePanel();
            });
        };

        const panelObserver = new MutationObserver(scheduleBarragePanelEnhancement);
        const discoverTimer = setInterval(() => {
            syncBarrageListDelegates();
            scheduleBarragePanelEnhancement();
        }, 2000);
        syncBarrageListDelegates();
        scheduleBarragePanelEnhancement();
        window.addEventListener("beforeunload", () => {
            clearInterval(discoverTimer);
            cleanupBarrageListDelegates();
            panelObserver.disconnect();
        });
    }

    function hasDisplayVersionUpdate(latestInfo) {
        const latestDisplay = normalizeRemoteVersionInfo(latestInfo)?.displayVersion || "";
        return compareVersions(latestDisplay, DISPLAY_VERSION) > 0;
    }

    function compareVersions(left, right) {
        const a = normalizeVersionForCompare(left);
        const b = normalizeVersionForCompare(right);
        const length = Math.max(a.length, b.length);
        for (let index = 0; index < length; index += 1) {
            const diff = (a[index] || 0) - (b[index] || 0);
            if (diff !== 0) return diff;
        }
        return 0;
    }

    function normalizeVersionForCompare(version) {
        let clean = String(version || "0").trim().replace(/^v/i, "");
        clean = LEGACY_VERSION_MAP[clean] || clean;
        return clean.split(/[^\d]+/).filter(Boolean).slice(0, 3).map(Number);
    }

    function setUpdateTip(latestVersionInfo) {
        const latestInfo = normalizeRemoteVersionInfo(latestVersionInfo);
        if (!latestInfo) return;
        state.updateLatestVersion = latestInfo.version;
        state.updateLatestDisplayVersion = latestInfo.displayVersion;
        if (!state.updateTipEl) return;
        state.updateTipEl.style.display = "block";
        state.updateTipEl.textContent = `新版本 ${latestInfo.displayVersion} ▾`;
        renderUpdateCard();
        state.updateTipEl.animate([
            { transform: "scale(1)" },
            { transform: "scale(1.08)" },
            { transform: "scale(1)" }
        ], { duration: 1000, iterations: Infinity });
    }

    function checkUpdate(manual = false) {
        requestLatestVersion({ force: manual })
            .then(latestVersionInfo => {
                const latestInfo = normalizeRemoteVersionInfo(latestVersionInfo);
                if (!latestInfo) throw new Error("missing version");
                if (hasDisplayVersionUpdate(latestInfo) || compareVersions(latestInfo.version, CURRENT_VERSION) > 0) {
                    setUpdateTip(latestInfo);
                    showMsg(`检测到新版本 ${latestInfo.displayVersion}，点击顶部提示更新`, "warn");
                } else if (manual) {
                    showMsg(`当前版本 ${DISPLAY_VERSION} 已是最新`);
                }
            })
            .catch(error => {
                console.error("[dgq63136] 更新检查失败", error);
                if (manual) showMsg("更新检查失败", "error");
            });
    }

    function getOrCreateSid() {
        return randomString(9).toLowerCase();
    }

    function initGFWebSocket() {
        if (window.top !== window.self) return;
        if (state.gfWebSocketStarted) return;
        state.gfWebSocketStarted = true;
        const targetWindow = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
        const lockKey = "__GF_WS_LOCK_DGQ63136__";
        if (targetWindow[lockKey]) {
            state.gfWebSocketStarted = false;
            return;
        }
        targetWindow[lockKey] = true;

        const manager = { instance: null, timer: null, delay: 3000 };
        const sid = getOrCreateSid();

        const connect = () => {
            try {
                const wsUrl = `wss://hguofichp.cn:10086/dgq/GFPlugin/ws/${sid}`;
                const WSCtor = typeof unsafeWindow !== "undefined" && unsafeWindow.WebSocket
                    ? unsafeWindow.WebSocket
                    : (window.WebSocket || WebSocket);
                const ws = new WSCtor(wsUrl);
                manager.instance = ws;

                ws.onopen = () => {
                    manager.delay = 3000;
                };
                ws.onmessage = event => {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.GFCount !== undefined) {
                            const element = document.getElementById("gf-online-dgq");
                            if (element) element.textContent = `插件在线：${data.GFCount}`;
                        }
                        if (data.count !== undefined) {
                            const element = document.getElementById("site-online-dgq");
                            if (element) element.textContent = `网站在线：${data.count}`;
                        }
                    } catch (error) {
                        console.warn("[dgq63136] WSS消息解析失败", error);
                    }
                };
                ws.onclose = event => {
                    if (event.code === 1000 || event.code === 1001) return;
                    clearTimeout(manager.timer);
                    manager.timer = setTimeout(connect, manager.delay);
                    manager.delay = Math.min(manager.delay * 2, 30000);
                };
                ws.onerror = () => ws.close();
            } catch (error) {
                console.error("[dgq63136] WSS启动失败", error);
                targetWindow[lockKey] = false;
                state.gfWebSocketStarted = false;
            }
        };

        window.addEventListener("beforeunload", () => {
            if (manager.instance) manager.instance.close(1000);
            targetWindow[lockKey] = false;
            state.gfWebSocketStarted = false;
        });
        connect();
    }

    function runWhenIdle(callback, timeout = 3000) {
        if (typeof requestIdleCallback === "function") {
            requestIdleCallback(callback, { timeout });
            return;
        }
        setTimeout(callback, Math.min(timeout, 1200));
    }

    function initMenuCommands() {
        if (typeof GM_registerMenuCommand !== "function") return;
        GM_registerMenuCommand("63136：检查更新", () => checkUpdate(true));
        GM_registerMenuCommand("63136：打开更新页", () => openExternalUrl(UPDATE_PAGE_URL));
        GM_registerMenuCommand("63136：打开本地收藏", () => {
            togglePanel(true);
            renderFavorites(1);
        });
    }

    purgeLegacyReviewSecrets();
    initMenuCommands();
    initKeyboardShortcuts();
    initPanelButtonActionCapture();
    initBarrageActions();
    insertToolbarToggleButton();
    initVideoSyncButton();
    initPlayerGiftPopupBlocker();
    setInterval(() => {
        insertToolbarToggleButton();
        ensureVideoSyncButton();
    }, 2000);
})();
