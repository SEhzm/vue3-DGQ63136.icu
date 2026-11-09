// ==UserScript==
// @name         dgq63136厕纸（抖音版）
// @namespace    https://dgq63136.cn/
// @version      v2026.11.09.07
// @description  dgq63136厕纸（抖音版）：原生飘屏弹幕悬停即停并显示+1与回复、播放器清晰度旁「厕纸」按钮与面板默认展示最新50条63136烂梗（支持触底自动加载下一页）/搜索发送、赞赏充电及自动检查更新/一键更新支持，兼容油猴 5.5.1 及以上
// @author       HZM
// @match        https://live.douyin.com/*
// @include      https://live.douyin.com/*
// @icon         https://apic.douyucdn.cn/upload/avatar_v3/201808/e2b4d01edd7dd82f44efeb434a0d3a86_big.jpg
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      api.hguofichp.cn
// @connect      dgq63136.cn
// @connect      cdn.hguofichp.cn
// @run-at       document-start
// @license      MIT
// @downloadURL  https://dgq63136.cn/douyin++.user.js
// @updateURL    https://dgq63136.cn/douyin++.user.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.top !== window.self) {
        return;
    }

    const CURRENT_VERSION = 'v2026.11.09.07';
    const SCRIPT_DOWNLOAD_URL = 'https://dgq63136.cn/douyin++.user.js';
    const PLUGIN_HEADER_NAME = 'dpahjdoiaw';
    const PLUGIN_HEADER_VALUE = 'douyinpp';
    const API_SEARCH_URL = 'https://api.hguofichp.cn/dgq/pageSearch';
    const API_PAGE_URL = 'https://api.hguofichp.cn/dgq/Page';
    const API_DICT_LIST_URL = 'https://api.hguofichp.cn/dgq/dictList';
    const API_ADD_CNT_URL = 'https://api.hguofichp.cn/dgq/addCnt';
    const BRAND_ICON_URL = 'https://apic.douyucdn.cn/upload/avatar_v3/201808/e2b4d01edd7dd82f44efeb434a0d3a86_big.jpg';
    const SPONSOR_WX_QR = 'https://cdn.hguofichp.cn/zfb.jpg';
    const SPONSOR_ALIPAY_QR = 'https://cdn.hguofichp.cn/%E6%94%AF%E4%BB%98%E5%AE%9D%E7%BB%8F%E8%90%A5%E7%A0%81.png';
    const SPONSOR_HOME_URL = 'https://dgq63136.cn';
    const DEFAULT_PAGE_SIZE = 50;

    console.log('[dgq63136 厕纸 douyin++] 抖音直播增强插件启动中，版本:', CURRENT_VERSION);

    function installMainWorldTransferHook() {
        const hookCode = `
            (function () {
                if (window.__dgq63136_transfer_hooked__) return;
                window.__dgq63136_transfer_hooked__ = true;
                var proto = window.HTMLCanvasElement && window.HTMLCanvasElement.prototype;
                if (!proto || !proto.transferControlToOffscreen) return;
                var origTransfer = proto.transferControlToOffscreen;
                proto.transferControlToOffscreen = function () {
                    try {
                        if (this.parentElement && this.parentElement.classList && this.parentElement.classList.contains('CanvasDanmakuPlugin')) {
                            return undefined;
                        }
                    } catch (e) {}
                    return origTransfer.apply(this, arguments);
                };
            })();
        `;

        let injected = false;
        try {
            const script = document.createElement('script');
            script.textContent = hookCode;
            (document.head || document.documentElement).appendChild(script);
            script.remove();
            injected = true;
        } catch (e) {}

        try {
            const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
            if (win && !win.__dgq63136_transfer_hooked__ && win.HTMLCanvasElement && win.HTMLCanvasElement.prototype.transferControlToOffscreen) {
                win.__dgq63136_transfer_hooked__ = true;
                const orig = win.HTMLCanvasElement.prototype.transferControlToOffscreen;
                win.HTMLCanvasElement.prototype.transferControlToOffscreen = function () {
                    try {
                        if (this.parentElement && this.parentElement.classList && this.parentElement.classList.contains('CanvasDanmakuPlugin')) {
                            return undefined;
                        }
                    } catch (e) {}
                    return orig.apply(this, arguments);
                };
            }
        } catch (e) {
            if (!injected) {
                console.warn('[dgq63136 厕纸 douyin++] transferControlToOffscreen Hook 注册受限:', e);
            }
        }
    }

    installMainWorldTransferHook();

    function addGlobalStyles(css) {
        const inject = () => {
            const target = document.head || document.documentElement;
            if (!target) return false;
            let style = document.getElementById('dgq63136-douyin-styles');
            if (!style) {
                style = document.createElement('style');
                style.id = 'dgq63136-douyin-styles';
                style.type = 'text/css';
                style.textContent = css;
                target.appendChild(style);
            }
            return true;
        };
        if (!inject()) {
            const t = setInterval(() => {
                if (inject()) clearInterval(t);
            }, 50);
        }
    }

    const globalStyles = `
        #dgq63136-douyin-ball {
            position: fixed;
            bottom: 136px;
            right: 16px;
            width: 46px;
            height: 46px;
            border-radius: 50%;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            box-shadow: 0 4px 16px rgba(22, 163, 74, 0.45);
            cursor: pointer;
            z-index: 2147483640;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
            user-select: none;
            border: 2px solid #ffffff;
            pointer-events: auto !important;
        }
        #dgq63136-douyin-ball:hover {
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 6px 20px rgba(22, 163, 74, 0.65);
        }
        #dgq63136-douyin-ball:active {
            transform: scale(0.95);
        }
        #dgq63136-douyin-ball img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            pointer-events: none;
            display: block;
        }
        #dgq63136-douyin-ball .pulse-badge {
            position: absolute;
            top: -3px;
            right: -3px;
            width: 12px;
            height: 12px;
            background-color: #ef4444;
            border: 2px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.85);
            pointer-events: none;
            display: none;
        }
        #dgq63136-douyin-ball .pulse-badge.visible {
            display: block;
            animation: dgq63136-badge-pulse 1.6s infinite;
        }
        @keyframes dgq63136-badge-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.18); }
        }

        .dgq63136-ctrl-slot {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            pointer-events: auto !important;
            position: relative !important;
            z-index: 50 !important;
            margin: 0 8px !important;
            height: 32px !important;
        }

        .dgq63136-toolbar-btn {
            display: inline-flex !important;
            align-items: center !important;
            gap: 5px !important;
            height: 26px !important;
            padding: 0 10px !important;
            background: linear-gradient(135deg, #22c55e, #15803d) !important;
            color: #ffffff !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            line-height: 1 !important;
            border-radius: 13px !important;
            border: 1px solid rgba(255, 255, 255, 0.25) !important;
            cursor: pointer !important;
            box-shadow: 0 2px 8px rgba(22, 163, 74, 0.35) !important;
            transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease !important;
            pointer-events: auto !important;
            user-select: none !important;
            white-space: nowrap !important;
            position: relative !important;
            z-index: 51 !important;
        }
        .dgq63136-toolbar-btn:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(22, 163, 74, 0.55) !important;
            background: linear-gradient(135deg, #16a34a, #15803d) !important;
        }
        .dgq63136-toolbar-btn:active {
            transform: scale(0.96) !important;
        }
        .dgq63136-toolbar-btn img {
            width: 16px !important;
            height: 16px !important;
            border-radius: 50% !important;
            pointer-events: none !important;
            display: block !important;
        }
        .dgq63136-toolbar-btn span {
            pointer-events: none !important;
            color: #ffffff !important;
        }

        #dgq63136-panel {
            position: fixed;
            top: 100px;
            right: 80px;
            width: 448px;
            height: 576px;
            background: rgba(255, 255, 255, 0.97);
            border-radius: 14px;
            box-shadow: 0 16px 36px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(0, 0, 0, 0.08);
            backdrop-filter: blur(12px);
            z-index: 2147483645;
            display: none;
            flex-direction: column;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #1f2937;
            animation: dgq63136-pop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: auto !important;
        }
        @keyframes dgq63136-pop-in {
            from { opacity: 0; transform: scale(0.94) translateY(-10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }

        body.dark #dgq63136-panel,
        [data-theme='dark'] #dgq63136-panel {
            background: rgba(24, 24, 27, 0.97);
            color: #f3f4f6;
            box-shadow: 0 16px 36px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.12);
        }

        .dgq63136-panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding: 11px 14px;
            background: linear-gradient(135deg, #f0fdf4, #dcfce7);
            border-bottom: 1px solid #bbf7d0;
            cursor: move;
            user-select: none;
            flex-shrink: 0;
        }
        body.dark .dgq63136-panel-header,
        [data-theme='dark'] .dgq63136-panel-header {
            background: linear-gradient(135deg, #14532d, #052e16);
            border-bottom-color: #166534;
        }
        .dgq63136-panel-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 700;
            font-size: 14px;
            color: #15803d;
            min-width: 0;
            white-space: nowrap;
        }
        body.dark .dgq63136-panel-title,
        [data-theme='dark'] .dgq63136-panel-title {
            color: #86efac;
        }
        .dgq63136-panel-title img {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            flex-shrink: 0;
        }
        .dgq63136-header-actions {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-shrink: 0;
        }
        .dgq63136-sponsor-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            height: 26px;
            padding: 0 10px;
            border-radius: 999px;
            border: 1px solid rgba(18, 150, 219, 0.35);
            background: linear-gradient(135deg, #e0f2fe, #bae6fd);
            color: #0369a1;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.15s ease;
            white-space: nowrap;
        }
        .dgq63136-sponsor-btn:hover,
        .dgq63136-sponsor-btn.active {
            background: linear-gradient(135deg, #0284c7, #0369a1);
            border-color: #0284c7;
            color: #ffffff;
            box-shadow: 0 2px 8px rgba(2, 132, 199, 0.35);
        }
        .dgq63136-sponsor-btn svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
            flex-shrink: 0;
        }
        body.dark .dgq63136-sponsor-btn,
        [data-theme='dark'] .dgq63136-sponsor-btn {
            background: rgba(14, 165, 233, 0.16);
            border-color: rgba(56, 189, 248, 0.4);
            color: #38bdf8;
        }
        body.dark .dgq63136-sponsor-btn:hover,
        body.dark .dgq63136-sponsor-btn.active,
        [data-theme='dark'] .dgq63136-sponsor-btn:hover,
        [data-theme='dark'] .dgq63136-sponsor-btn.active {
            background: #0284c7;
            color: #ffffff;
        }
        .dgq63136-icon-btn {
            position: relative;
            background: transparent;
            border: none;
            width: 26px;
            height: 26px;
            border-radius: 6px;
            cursor: pointer;
            color: #4b5563;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            transition: background 0.15s ease, color 0.15s ease;
        }
        .dgq63136-icon-btn svg {
            width: 15px;
            height: 15px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            pointer-events: none;
        }
        .dgq63136-icon-btn.checking svg {
            animation: dgq63136-spin 0.85s linear infinite;
        }
        @keyframes dgq63136-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .dgq63136-icon-btn.has-update {
            color: #d97706;
            background: rgba(245, 158, 11, 0.14);
        }
        .dgq63136-update-badge {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #ef4444;
            border: 1.5px solid #ffffff;
            display: none;
            pointer-events: none;
        }
        .dgq63136-icon-btn.has-update .dgq63136-update-badge {
            display: block;
        }
        .dgq63136-icon-btn:hover {
            background: rgba(0, 0, 0, 0.08);
            color: #111827;
        }
        body.dark .dgq63136-icon-btn,
        [data-theme='dark'] .dgq63136-icon-btn {
            color: #9ca3af;
        }
        body.dark .dgq63136-icon-btn:hover,
        [data-theme='dark'] .dgq63136-icon-btn:hover {
            background: rgba(255, 255, 255, 0.12);
            color: #ffffff;
        }
        body.dark .dgq63136-icon-btn.has-update,
        [data-theme='dark'] .dgq63136-icon-btn.has-update {
            color: #fbbf24;
            background: rgba(251, 191, 36, 0.16);
        }

        #dgq63136-update-bar {
            display: none;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin: 10px 14px 0;
            padding: 8px 10px;
            border-radius: 8px;
            background: linear-gradient(135deg, #fffbeb, #fef3c7);
            border: 1px solid #fcd34d;
            color: #92400e;
            font-size: 12.5px;
            flex-shrink: 0;
        }
        body.dark #dgq63136-update-bar,
        [data-theme='dark'] #dgq63136-update-bar {
            background: rgba(217, 119, 6, 0.16);
            border-color: rgba(251, 191, 36, 0.4);
            color: #fde68a;
        }
        .dgq63136-update-bar-text {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .dgq63136-update-bar-actions {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-shrink: 0;
        }
        .dgq63136-update-now-btn {
            padding: 4px 10px;
            border-radius: 6px;
            border: none;
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: #ffffff;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            transition: transform 0.12s ease, filter 0.12s ease;
        }
        .dgq63136-update-now-btn:hover {
            transform: scale(1.03);
            filter: brightness(1.06);
        }
        .dgq63136-update-dismiss-btn {
            background: transparent;
            border: none;
            color: inherit;
            opacity: 0.7;
            cursor: pointer;
            font-size: 13px;
            padding: 2px 4px;
            line-height: 1;
        }
        .dgq63136-update-dismiss-btn:hover {
            opacity: 1;
        }

        #dgq63136-update-banner {
            position: fixed;
            top: 16px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2147483646;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 9px 14px;
            border-radius: 999px;
            background: rgba(17, 24, 39, 0.94);
            color: #ffffff;
            border: 1px solid rgba(251, 191, 36, 0.55);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.36);
            backdrop-filter: blur(8px);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 13px;
            pointer-events: auto !important;
            user-select: none;
            white-space: nowrap;
            max-width: calc(100vw - 24px);
        }
        #dgq63136-update-banner strong {
            color: #fcd34d;
        }
        .dgq63136-banner-btn {
            padding: 4px 12px;
            border-radius: 999px;
            border: none;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            pointer-events: auto !important;
            white-space: nowrap;
            transition: transform 0.12s ease, filter 0.12s ease;
        }
        .dgq63136-banner-btn:hover {
            transform: scale(1.04);
            filter: brightness(1.08);
        }
        .dgq63136-banner-close {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.72);
            cursor: pointer;
            font-size: 14px;
            padding: 0 2px;
            line-height: 1;
            pointer-events: auto !important;
        }
        .dgq63136-banner-close:hover {
            color: #ffffff;
        }

        .dgq63136-main-view {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 0;
            overflow: hidden;
        }

        .dgq63136-search-area {
            padding: 12px 14px 8px;
            display: flex;
            gap: 8px;
            flex-shrink: 0;
        }
        .dgq63136-search-input {
            flex: 1;
            height: 36px;
            padding: 0 12px;
            border-radius: 8px;
            border: 1px solid #d1d5db;
            background: #f9fafb;
            color: inherit;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .dgq63136-search-input:focus {
            border-color: #22c55e;
            box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
            background: #ffffff;
        }
        body.dark .dgq63136-search-input,
        [data-theme='dark'] .dgq63136-search-input {
            background: #27272a;
            border-color: #3f3f46;
        }
        body.dark .dgq63136-search-input:focus,
        [data-theme='dark'] .dgq63136-search-input:focus {
            background: #18181b;
        }
        .dgq63136-search-btn {
            height: 36px;
            padding: 0 16px;
            border-radius: 8px;
            border: none;
            background: #22c55e;
            color: #ffffff;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.15s ease;
            white-space: nowrap;
        }
        .dgq63136-search-btn:hover {
            background: #16a34a;
        }

        .dgq63136-tags-bar {
            padding: 0 14px 6px;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            max-height: 58px;
            overflow-y: auto;
            flex-shrink: 0;
        }
        .dgq63136-tag-item {
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 4px;
            background: #f3f4f6;
            color: #4b5563;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .dgq63136-tag-item:hover,
        .dgq63136-tag-item.active {
            background: #dcfce7;
            color: #15803d;
            font-weight: 600;
        }
        body.dark .dgq63136-tag-item,
        [data-theme='dark'] .dgq63136-tag-item {
            background: #27272a;
            color: #9ca3af;
        }
        body.dark .dgq63136-tag-item:hover,
        body.dark .dgq63136-tag-item.active,
        [data-theme='dark'] .dgq63136-tag-item:hover,
        [data-theme='dark'] .dgq63136-tag-item.active {
            background: #14532d;
            color: #86efac;
        }

        .dgq63136-list-status {
            padding: 2px 14px 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            color: #6b7280;
            flex-shrink: 0;
        }
        body.dark .dgq63136-list-status,
        [data-theme='dark'] .dgq63136-list-status {
            color: #9ca3af;
        }
        .dgq63136-reset-link {
            color: #16a34a;
            background: transparent;
            border: none;
            padding: 0;
            font-size: 12px;
            cursor: pointer;
            text-decoration: underline;
        }
        .dgq63136-reset-link:hover {
            color: #15803d;
        }

        .dgq63136-list-container {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            padding: 2px 14px 14px;
        }
        .dgq63136-list-container::-webkit-scrollbar {
            width: 6px;
        }
        .dgq63136-list-container::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 3px;
        }
        .dgq63136-list-footer {
            padding: 8px 4px 4px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            line-height: 1.5;
            user-select: none;
        }
        .dgq63136-load-more-btn {
            background: transparent;
            border: none;
            padding: 0 2px;
            color: #16a34a;
            font-size: 12px;
            cursor: pointer;
            text-decoration: underline;
        }
        .dgq63136-load-more-btn:hover {
            color: #15803d;
        }
        .dgq63136-meme-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 10px 12px;
            margin-bottom: 8px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            transition: all 0.15s ease;
        }
        .dgq63136-meme-card:hover {
            border-color: #86efac;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            background: #fdfdfd;
        }
        body.dark .dgq63136-meme-card,
        [data-theme='dark'] .dgq63136-meme-card {
            background: #27272a;
            border-color: #3f3f46;
        }
        body.dark .dgq63136-meme-card:hover,
        [data-theme='dark'] .dgq63136-meme-card:hover {
            border-color: #16a34a;
            background: #1f1f23;
        }
        .dgq63136-meme-text {
            flex: 1;
            font-size: 13px;
            line-height: 1.5;
            word-break: break-all;
            color: inherit;
            cursor: pointer;
        }
        .dgq63136-meme-text:hover {
            color: #16a34a;
        }
        .dgq63136-meme-actions {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-shrink: 0;
        }
        .dgq63136-btn-copy {
            padding: 4px 10px;
            font-size: 12px;
            border-radius: 5px;
            border: 1px solid #d1d5db;
            background: #f9fafb;
            color: #374151;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .dgq63136-btn-copy:hover {
            border-color: #10b981;
            color: #10b981;
        }
        .dgq63136-btn-send {
            padding: 4px 12px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 5px;
            border: none;
            background: #f97316;
            color: #ffffff;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .dgq63136-btn-send:hover {
            background: #ea580c;
            transform: scale(1.02);
        }

        .dgq63136-sponsor-view {
            display: none;
            flex-direction: column;
            align-items: center;
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            padding: 16px 18px 18px;
            gap: 12px;
        }
        .dgq63136-sponsor-top {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .dgq63136-back-btn {
            padding: 5px 12px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 6px;
            border: 1px solid #d1d5db;
            background: #f9fafb;
            color: #374151;
            cursor: pointer;
        }
        .dgq63136-back-btn:hover {
            border-color: #22c55e;
            color: #16a34a;
        }
        .dgq63136-sponsor-tabs {
            display: flex;
            gap: 8px;
        }
        .dgq63136-sponsor-tab {
            padding: 5px 14px;
            font-size: 12.5px;
            font-weight: 600;
            border-radius: 999px;
            border: 1px solid #d1d5db;
            background: #f9fafb;
            color: #4b5563;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .dgq63136-sponsor-tab.active {
            background: #0284c7;
            border-color: #0284c7;
            color: #ffffff;
        }
        .dgq63136-sponsor-qr-box {
            width: 240px;
            height: 240px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }
        .dgq63136-sponsor-qr-box img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            display: block;
        }
        .dgq63136-sponsor-desc {
            font-size: 13px;
            color: #4b5563;
            text-align: center;
            line-height: 1.5;
        }
        body.dark .dgq63136-sponsor-desc,
        [data-theme='dark'] .dgq63136-sponsor-desc {
            color: #d1d5db;
        }
        .dgq63136-sponsor-links {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .dgq63136-sponsor-open-btn {
            padding: 6px 14px;
            border-radius: 8px;
            border: none;
            background: linear-gradient(135deg, #0284c7, #0369a1);
            color: #ffffff;
            font-size: 12.5px;
            font-weight: 600;
            cursor: pointer;
        }
        .dgq63136-sponsor-open-btn.secondary {
            background: #22c55e;
        }

        #dgq63136-toast {
            position: fixed;
            top: 60px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            opacity: 0;
            background: rgba(17, 24, 39, 0.92);
            color: #ffffff;
            padding: 8px 18px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
            z-index: 2147483647;
            pointer-events: none;
            transition: opacity 0.22s ease, transform 0.22s ease;
            backdrop-filter: blur(4px);
        }
        #dgq63136-toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }

        #dgq63136-danmu-highlight-box {
            position: fixed;
            z-index: 2147483635;
            display: none;
            pointer-events: none;
            border: 1.5px solid rgba(34, 197, 94, 0.88);
            background: rgba(34, 197, 94, 0.14);
            border-radius: 6px;
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
            box-sizing: border-box;
        }

        #dgq63136-danmu-actions {
            position: fixed;
            z-index: 2147483638;
            display: none;
            align-items: center;
            gap: 5px;
            padding: 2px 4px;
            border-radius: 16px;
            background: rgba(17, 24, 39, 0.88);
            border: 1px solid rgba(255, 255, 255, 0.22);
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.48);
            backdrop-filter: blur(6px);
            pointer-events: auto !important;
            user-select: none;
        }
        .dgq63136-danmu-action-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 24px;
            padding: 0 10px;
            border-radius: 12px;
            border: none;
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            pointer-events: auto !important;
            white-space: nowrap;
            transition: transform 0.12s ease, filter 0.12s ease;
        }
        .dgq63136-danmu-action-btn:hover {
            transform: scale(1.06);
            filter: brightness(1.08);
        }
        .dgq63136-danmu-action-btn:active {
            transform: scale(0.95);
        }
        #dgq63136-plus1-btn {
            background: linear-gradient(135deg, #22c55e, #16a34a);
        }
        #dgq63136-reply-btn {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
        }
    `;

    addGlobalStyles(globalStyles);

    let tagList = [];
    let isCooldown = false;
    let activeTagValue = '';
    let hasLoadedDefaultMemes = false;
    let listMode = 'default';
    let currentTagLabel = '';
    let currentSearchKeyword = '';
    let currentPageNum = 1;
    let currentTotalCount = 0;
    let serverFetchedCount = 0;
    let hasMoreMemes = false;
    let isLoadingPage = false;
    let listRequestSeq = 0;
    let loadedMemeList = [];
    const loadedMemeKeys = new Set();
    let availableRemoteVersion = '';
    let isCheckingUpdate = false;
    const msgMetaMap = new Map();
    const emojiUrlToNameMap = new Map();
    let emojiReverseReady = false;

    function getOverlayRoot() {
        return document.fullscreenElement || document.webkitFullscreenElement || document.body || document.documentElement;
    }

    function ensureInOverlayRoot(el) {
        if (!el) return;
        const root = getOverlayRoot();
        if (root && el.parentElement !== root) {
            root.appendChild(el);
        }
    }

    function showToast(message, duration = 2200) {
        let toast = document.getElementById('dgq63136-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'dgq63136-toast';
        }
        ensureInOverlayRoot(toast);
        toast.innerText = message;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    function copyText(text, id) {
        const onCopied = () => {
            showToast('✔️ 复制成功！');
            if (id) reportCopy(id);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(onCopied).catch(() => {
                fallbackCopy(text, id);
            });
        } else {
            fallbackCopy(text, id);
        }
    }

    function fallbackCopy(text, id) {
        try {
            const temp = document.createElement('textarea');
            temp.value = text;
            temp.style.position = 'fixed';
            temp.style.opacity = '0';
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            temp.remove();
            showToast('✔️ 复制成功！');
            if (id) reportCopy(id);
        } catch (e) {
            showToast('❌ 复制失败，请手动选取');
        }
    }

    function gmRequestText(method, url, bodyData, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const headers = {
                [PLUGIN_HEADER_NAME]: PLUGIN_HEADER_VALUE
            };
            if (method === 'POST') {
                headers['Content-Type'] = 'application/json';
            }

            try {
                if (typeof GM_xmlhttpRequest === 'function') {
                    GM_xmlhttpRequest({
                        method,
                        url,
                        headers,
                        data: bodyData,
                        timeout,
                        onload: (res) => {
                            if (res.status >= 200 && res.status < 300) {
                                resolve(res.responseText);
                            } else {
                                reject(new Error('HTTP ' + res.status));
                            }
                        },
                        onerror: (err) => reject(err || new Error('网络请求失败')),
                        ontimeout: () => reject(new Error('请求超时'))
                    });
                    return;
                }
            } catch (e) {}

            const fetchOpts = { method, headers };
            if (method === 'POST' && bodyData !== undefined) {
                fetchOpts.body = bodyData;
            }
            fetch(url, fetchOpts)
                .then(r => {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    return r.text();
                })
                .then(resolve)
                .catch(reject);
        });
    }

    function reportCopy(id) {
        if (!id) return;
        gmRequestText('GET', `${API_ADD_CNT_URL}/${encodeURIComponent(id)}`, undefined, 6000).catch(() => {});
    }

    function cleanVersion(ver) {
        return String(ver || '').trim().replace(/^v/i, '');
    }

    function compareVersions(verA, verB) {
        const partsA = cleanVersion(verA).split(/[^0-9]+/).filter(Boolean).map(Number);
        const partsB = cleanVersion(verB).split(/[^0-9]+/).filter(Boolean).map(Number);
        const maxLen = Math.max(partsA.length, partsB.length);
        for (let i = 0; i < maxLen; i++) {
            const a = partsA[i] || 0;
            const b = partsB[i] || 0;
            if (a > b) return 1;
            if (a < b) return -1;
        }
        return 0;
    }

    function getScriptUpdateUrl() {
        try {
            if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
                const candidate = GM_info.script.updateURL || GM_info.script.downloadURL;
                if (typeof candidate === 'string' && /^https?:\/\//i.test(candidate)) {
                    return candidate.split('?')[0];
                }
            }
        } catch (e) {}
        return SCRIPT_DOWNLOAD_URL;
    }

    function triggerOneClickUpdate() {
        const targetUrl = getScriptUpdateUrl();
        showToast('🚀 正在打开 Tampermonkey 一键更新页...', 2800);
        const opened = window.open(targetUrl, '_blank');
        if (!opened) {
            try {
                const a = document.createElement('a');
                a.href = targetUrl;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.style.display = 'none';
                (document.body || document.documentElement).appendChild(a);
                a.click();
                a.remove();
            } catch (e) {
                showToast('⚠️ 弹窗被浏览器拦截，请允许弹窗后重试', 3200);
            }
        }
    }

    function removeUpdateBanner() {
        const banner = document.getElementById('dgq63136-update-banner');
        if (banner) banner.remove();
    }

    function showUpdateBanner(remoteVer) {
        let banner = document.getElementById('dgq63136-update-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'dgq63136-update-banner';
            banner.innerHTML = `
                <span class="dgq63136-banner-msg"></span>
                <button id="dgq63136-banner-update-now" class="dgq63136-banner-btn" type="button">一键更新</button>
                <button id="dgq63136-banner-update-close" class="dgq63136-banner-close" type="button" title="关闭提示">✕</button>
            `;
            const stopEvt = (e) => e.stopPropagation();
            banner.addEventListener('pointerdown', stopEvt);
            banner.addEventListener('mousedown', stopEvt);
            banner.addEventListener('mouseup', stopEvt);
            banner.addEventListener('click', stopEvt);
            banner.addEventListener('keydown', stopEvt);

            banner.querySelector('#dgq63136-banner-update-now').addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                triggerOneClickUpdate();
            });
            banner.querySelector('#dgq63136-banner-update-close').addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                banner.remove();
            });
        }
        const msgEl = banner.querySelector('.dgq63136-banner-msg');
        if (msgEl) {
            msgEl.innerHTML = `🎉 dgq63136厕纸（抖音版）发现新版本：<strong>${remoteVer}</strong>（当前：${CURRENT_VERSION}）`;
        }
        ensureInOverlayRoot(banner);
    }

    function syncUpdateUIState(forceShowPrompts = false) {
        const hasUpdate = Boolean(availableRemoteVersion);
        const ball = document.getElementById('dgq63136-douyin-ball');
        const ballBadge = ball ? ball.querySelector('.pulse-badge') : null;
        if (ball) {
            ball.title = hasUpdate
                ? `dgq63136厕纸（抖音版）· 发现新版本 ${availableRemoteVersion}`
                : 'dgq63136厕纸（抖音版）(点击打开/关闭厕纸面板)';
        }
        if (ballBadge) {
            ballBadge.classList.toggle('visible', hasUpdate);
        }

        if (updateBtnEl) {
            updateBtnEl.classList.toggle('has-update', hasUpdate);
            updateBtnEl.title = hasUpdate
                ? `发现新版本 ${availableRemoteVersion}，点击重新检查更新`
                : `检查更新 (当前 ${CURRENT_VERSION})`;
        }

        if (updateBarEl && updateBarTextEl) {
            if (hasUpdate) {
                updateBarTextEl.innerText = `📢 发现新版本 ${availableRemoteVersion}（当前 ${CURRENT_VERSION}）`;
                if (forceShowPrompts || updateBarEl.dataset.dismissed !== '1') {
                    updateBarEl.dataset.dismissed = '0';
                    updateBarEl.style.display = 'flex';
                }
            } else {
                updateBarEl.dataset.dismissed = '0';
                updateBarEl.style.display = 'none';
            }
        }

        if (hasUpdate && forceShowPrompts) {
            showUpdateBanner(availableRemoteVersion);
        } else if (!hasUpdate) {
            removeUpdateBanner();
        }
    }

    function checkUpdate(isManual = false) {
        if (isCheckingUpdate) {
            if (isManual) showToast('🔍 正在检查更新，请稍候...', 1400);
            return;
        }
        isCheckingUpdate = true;
        if (updateBtnEl) updateBtnEl.classList.add('checking');
        if (isManual) {
            showToast('🔍 正在检查更新...', 1600);
        }

        const baseUrl = getScriptUpdateUrl();
        const checkUrl = `${baseUrl}?_t=${Date.now()}`;

        gmRequestText('GET', checkUrl, undefined, 8000)
            .then((content) => {
                const match = String(content || '').match(/@version\s+([^\s\r\n]+)/i);
                if (!match || !match[1]) {
                    if (isManual) showToast('⚠️ 未能解析远端版本号，请稍后再试', 2200);
                    return;
                }
                const cleanedRemote = cleanVersion(match[1]);
                const displayRemote = `v${cleanedRemote}`;
                if (compareVersions(cleanedRemote, CURRENT_VERSION) > 0) {
                    availableRemoteVersion = displayRemote;
                    syncUpdateUIState(true);
                    if (isManual) {
                        showToast(`🎉 发现新版本 ${displayRemote}，请点击「一键更新」`, 3000);
                    }
                } else {
                    availableRemoteVersion = '';
                    syncUpdateUIState(false);
                    if (isManual) {
                        showToast(`当前已是最新版本 (${CURRENT_VERSION}) 🎉`, 2500);
                    }
                }
            })
            .catch(() => {
                if (isManual) {
                    showToast('❌ 检查更新失败，请确认网络连接', 2400);
                }
            })
            .finally(() => {
                isCheckingUpdate = false;
                if (updateBtnEl) updateBtnEl.classList.remove('checking');
            });
    }

    function normalizeSingleLineText(str) {
        return String(str || '')
            .replace(/[\r\n\u200B\u200C\u200D\uFEFF]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function isElementVisible(el) {
        if (!el || !el.isConnected) return false;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
            return false;
        }
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    function isExcludedInputElement(el) {
        if (!el) return true;
        if (el.closest('#dgq63136-panel') || el.closest('#sb6657-panel')) return true;
        if (el.closest('.JN8cXbhY')) return true;
        const ph = el.getAttribute('placeholder') || '';
        if (/搜索|关键词|投诉|举报|说明/.test(ph)) return true;
        return false;
    }

    function getChatInput() {
        const prioritizedSelectors = [
            '#chatroom .webcast-chatroom___input-container [contenteditable="true"]',
            '#chatroom .editor-kit-container[contenteditable="true"]',
            '#chatroom .U33JghOD[contenteditable="true"]',
            '#chatroom [data-e2e="live-chatting"] [contenteditable="true"]',
            '.webcast-chatroom___input-container [contenteditable="true"]',
            '.editor-kit-container[contenteditable="true"]',
            '.U33JghOD[contenteditable="true"]',
            '[data-e2e="live-chatting"] [contenteditable="true"]',
            '#chatroom textarea.webcast-chatroom___textarea',
            'textarea.webcast-chatroom___textarea',
            'textarea.sj0L4UzZ',
            '.FoldChatRoomCommentPlugin textarea',
            'textarea[placeholder*="聊" i]',
            'textarea[placeholder*="说点什么" i]',
            'input[placeholder*="说点什么" i]'
        ];

        for (const sel of prioritizedSelectors) {
            const list = document.querySelectorAll(sel);
            for (const el of list) {
                if (!isExcludedInputElement(el) && isElementVisible(el)) {
                    return el;
                }
            }
        }

        const chatroomRoot = document.getElementById('chatroom');
        if (chatroomRoot) {
            const fallbacks = chatroomRoot.querySelectorAll('[contenteditable="true"], textarea');
            for (const el of fallbacks) {
                if (!isExcludedInputElement(el) && isElementVisible(el)) {
                    return el;
                }
            }
        }
        return null;
    }

    function findRichTextEditorInstance(el) {
        if (!el) return null;
        try {
            let cur = el;
            for (let depth = 0; cur && depth < 6; depth++) {
                const fk = Object.keys(cur).find(
                    k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance')
                );
                if (fk) {
                    let fiber = cur[fk];
                    for (let steps = 0; fiber && steps < 12; steps++) {
                        const props = fiber.memoizedProps;
                        if (props) {
                            const direct = props.editor || props.editorRef?.current || props.instance;
                            if (direct && (typeof direct.setText === 'function' || typeof direct.reset === 'function')) {
                                return direct;
                            }
                        }
                        let st = fiber.memoizedState;
                        for (let s = 0; st && s < 10; s++) {
                            const m = st.memoizedState;
                            const candidate = m && typeof m === 'object' ? (m.current || m) : null;
                            if (candidate && (typeof candidate.setText === 'function' || typeof candidate.reset === 'function')) {
                                return candidate;
                            }
                            st = st.next;
                        }
                        fiber = fiber.return;
                    }
                }
                cur = cur.parentElement;
            }
        } catch (e) {}
        return null;
    }

    function setCaretToEnd(el) {
        try {
            el.focus();
            const sel = window.getSelection();
            if (!sel) return;
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        } catch (e) {}
    }

    function trySelectAllAndInsertText(el, text) {
        try {
            el.focus();
            const sel = window.getSelection();
            if (sel) {
                const range = document.createRange();
                range.selectNodeContents(el);
                sel.removeAllRanges();
                sel.addRange(range);
            }
            if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
                document.execCommand('delete', false);
                const inserted = document.execCommand('insertText', false, text);
                if (inserted && normalizeSingleLineText(el.innerText) === text) {
                    setCaretToEnd(el);
                    return true;
                }
            }
        } catch (e) {}
        return false;
    }

    function tryReplaceViaPasteEvent(el, text) {
        try {
            el.focus();
            const sel = window.getSelection();
            if (sel) {
                const range = document.createRange();
                range.selectNodeContents(el);
                sel.removeAllRanges();
                sel.addRange(range);
            }
            const dt = new DataTransfer();
            dt.setData('text/plain', text);
            const pasteEvt = new ClipboardEvent('paste', {
                bubbles: true,
                cancelable: true,
                clipboardData: dt
            });
            el.dispatchEvent(pasteEvt);
            if (normalizeSingleLineText(el.innerText) === text) {
                setCaretToEnd(el);
                return true;
            }
        } catch (e) {}
        return false;
    }

    function setChatInputValue(el, value) {
        if (!el) return;
        const singleLine = normalizeSingleLineText(value);
        el.focus();

        if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
            const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
            const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
            if (nativeSetter) {
                nativeSetter.call(el, singleLine);
            } else {
                el.value = singleLine;
            }
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            try {
                const len = el.value.length;
                el.setSelectionRange(len, len);
            } catch (e) {}
            return;
        }

        const editorInst = findRichTextEditorInstance(el);
        if (editorInst) {
            try {
                if (typeof editorInst.reset === 'function') {
                    editorInst.reset();
                }
                if (typeof editorInst.setText === 'function') {
                    editorInst.setText(singleLine);
                    if (typeof editorInst.focusAtEnd === 'function') {
                        editorInst.focusAtEnd();
                    } else if (typeof editorInst.focus === 'function') {
                        editorInst.focus();
                    }
                    el.dispatchEvent(new InputEvent('input', { bubbles: true, data: singleLine, inputType: 'insertText' }));
                    setCaretToEnd(el);
                    return;
                }
            } catch (e) {}
        }

        if (trySelectAllAndInsertText(el, singleLine)) {
            return;
        }

        if (tryReplaceViaPasteEvent(el, singleLine)) {
            return;
        }

        const zone = el.querySelector('.zone-container');
        if (zone) {
            zone.innerHTML = '';
            const line = document.createElement('div');
            line.className = 'ace-line';
            const leaf = document.createElement('span');
            leaf.setAttribute('data-leaf', 'true');
            const span = document.createElement('span');
            span.setAttribute('data-string', 'true');
            span.textContent = singleLine;
            leaf.appendChild(span);
            line.appendChild(leaf);
            zone.appendChild(line);
        } else {
            el.textContent = singleLine;
        }

        try {
            el.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, cancelable: true, data: singleLine, inputType: 'insertFromPaste' }));
            el.dispatchEvent(new InputEvent('input', { bubbles: true, data: singleLine, inputType: 'insertFromPaste' }));
        } catch (e) {
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }
        el.dispatchEvent(new Event('change', { bubbles: true }));
        setCaretToEnd(el);
    }

    function findSendButton(inputEl) {
        const container = inputEl?.closest('#chatroom') || document;
        const selectors = [
            'button.webcast-chatroom___send-btn',
            '.webcast-chatroom___send-btn',
            'button[data-e2e="chat-send-btn"]',
            '.FoldChatRoomCommentPlugin button[type="button"]',
            'button[type="submit"]'
        ];
        for (const sel of selectors) {
            const btn = container.querySelector(sel) || document.querySelector(sel);
            if (btn && isElementVisible(btn)) return btn;
        }

        const parentScope = inputEl?.closest('[data-e2e="live-chatting"]') || inputEl?.parentElement?.parentElement || container;
        const buttons = parentScope.querySelectorAll('button, div[role="button"]');
        for (const b of buttons) {
            if (!isElementVisible(b)) continue;
            const t = (b.innerText || b.getAttribute('aria-label') || '').trim();
            if (t === '发送' || /发送/.test(t)) return b;
        }
        return null;
    }

    function sendCurrentInput(inputEl) {
        if (!inputEl) return false;
        const sendBtn = findSendButton(inputEl);
        if (sendBtn && !sendBtn.disabled && !sendBtn.classList.contains('disabled')) {
            sendBtn.click();
            return true;
        }

        const enterInit = {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        };
        inputEl.dispatchEvent(new KeyboardEvent('keydown', enterInit));
        inputEl.dispatchEvent(new KeyboardEvent('keypress', enterInit));
        inputEl.dispatchEvent(new KeyboardEvent('keyup', enterInit));
        return true;
    }

    function sendBarrage(text, memeId) {
        if (!text || !String(text).trim()) {
            showToast('⚠️ 弹幕内容不能为空');
            return;
        }

        if (isCooldown) {
            showToast('⏳ 发送冷却中，请稍候...');
            return;
        }

        const input = getChatInput();
        if (!input) {
            showToast('❌ 未找到弹幕输入框，请先登录抖音直播间');
            return;
        }

        const cleanText = normalizeSingleLineText(text);
        if (!cleanText) {
            showToast('⚠️ 弹幕内容不能为空');
            return;
        }
        isCooldown = true;
        setChatInputValue(input, cleanText);

        setTimeout(() => {
            sendCurrentInput(input);
            showToast(`✔️ 弹幕发送中：${cleanText.length > 18 ? cleanText.slice(0, 18) + '...' : cleanText}`);
            if (memeId) reportCopy(memeId);
            setTimeout(() => {
                isCooldown = false;
            }, 3000);
        }, 120);
    }

    function fillReplyToChatInput(sender, content) {
        const cleanContent = normalizeSingleLineText(content);
        if (!cleanContent) {
            showToast('⚠️ 弹幕内容不能为空');
            return;
        }

        const input = getChatInput();
        if (!input) {
            showToast('❌ 未找到弹幕输入框，请先登录抖音直播间');
            return;
        }

        const senderId = normalizeSingleLineText(sender) || '观众';
        const replyText = `@${senderId}：${cleanContent}`;
        setChatInputValue(input, replyText);
        showToast(`💬 已放入回复内容：@${senderId}`);
    }

    function parsePagedResponse(resText) {
        const res = JSON.parse(resText);
        if (res.code !== 200 && res.code !== '200') {
            return { list: [], total: 0, isLastPage: true };
        }
        const data = res.data;
        if (Array.isArray(data)) {
            return { list: data, total: data.length, isLastPage: true };
        }
        const list = Array.isArray(data?.list) ? data.list : [];
        const total = Number(data?.total) || 0;
        const explicitLast = typeof data?.lastPage === 'boolean'
            ? data.lastPage
            : (typeof data?.isLastPage === 'boolean' ? data.isLastPage : null);
        const isLastPage = explicitLast !== null ? explicitLast : list.length < DEFAULT_PAGE_SIZE;
        return { list, total, isLastPage };
    }

    function searchMemesPage(keyword, pageNum) {
        const postData = JSON.stringify({
            D: '油猴',
            barrage: keyword,
            pageNum,
            pageSize: DEFAULT_PAGE_SIZE,
            sort: 0
        });
        return gmRequestText('POST', API_SEARCH_URL, postData, 10000).then(parsePagedResponse);
    }

    function fetchMemesPage(tagValue, pageNum) {
        let url = `${API_PAGE_URL}?pageNum=${pageNum}&pageSize=${DEFAULT_PAGE_SIZE}`;
        if (tagValue) {
            url += `&tags=${encodeURIComponent(tagValue)}`;
        }
        return gmRequestText('GET', url, undefined, 10000).then(parsePagedResponse);
    }

    function fetchDictTags() {
        gmRequestText('GET', API_DICT_LIST_URL, undefined, 8000)
            .then((resText) => {
                const res = JSON.parse(resText);
                if (res.code === 200 && Array.isArray(res.data)) {
                    tagList = res.data;
                    renderTagsBar();
                }
            })
            .catch(() => {});
    }

    let panelEl = null;
    let mainViewEl = null;
    let sponsorViewEl = null;
    let sponsorBtnEl = null;
    let updateBtnEl = null;
    let updateBarEl = null;
    let updateBarTextEl = null;
    let listStatusEl = null;
    let listContainerEl = null;
    let listItemsEl = null;
    let listFooterEl = null;
    let tagsBarEl = null;
    let searchInputEl = null;

    function switchToMainView() {
        if (!mainViewEl || !sponsorViewEl) return;
        sponsorViewEl.style.display = 'none';
        mainViewEl.style.display = 'flex';
        if (sponsorBtnEl) sponsorBtnEl.classList.remove('active');
    }

    function toggleSponsorView(e) {
        if (e) e.stopPropagation();
        if (!mainViewEl || !sponsorViewEl) return;
        const showingSponsor = sponsorViewEl.style.display === 'flex';
        if (showingSponsor) {
            switchToMainView();
        } else {
            mainViewEl.style.display = 'none';
            sponsorViewEl.style.display = 'flex';
            if (sponsorBtnEl) sponsorBtnEl.classList.add('active');
        }
    }

    function createPanel() {
        if (panelEl) {
            ensureInOverlayRoot(panelEl);
            return panelEl;
        }

        panelEl = document.createElement('div');
        panelEl.id = 'dgq63136-panel';
        panelEl.innerHTML = `
            <div class="dgq63136-panel-header" id="dgq63136-panel-header">
                <div class="dgq63136-panel-title">
                    <img src="${BRAND_ICON_URL}" alt="LOGO">
                    <span>dgq63136厕纸（抖音版）</span>
                </div>
                <div class="dgq63136-header-actions">
                    <button class="dgq63136-sponsor-btn" id="dgq63136-btn-sponsor" type="button" title="赞赏支持 / 为 dgq63136.cn 充电">
                        <svg viewBox="0 0 1024 1024" aria-hidden="true">
                            <path d="M395.765 586.57H224.032c-22.421 0-37.888-22.442-29.909-43.38L364.768 95.275A32 32 0 0 1 394.667 74.667h287.957c22.72 0 38.208 23.018 29.632 44.064l-99.36 243.882h187.05c27.51 0 42.187 32.427 24.043 53.099l-458.603 522.56c-22.293 25.408-63.626 3.392-54.976-29.28l85.355-322.422z"></path>
                        </svg>
                        <span>充电赞赏</span>
                    </button>
                    <button class="dgq63136-icon-btn" id="dgq63136-btn-update" type="button" title="检查更新 (当前 ${CURRENT_VERSION})">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                            <path d="M3 3v5h5"></path>
                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                            <path d="M16 16h5v5"></path>
                        </svg>
                        <span class="dgq63136-update-badge" id="dgq63136-update-badge"></span>
                    </button>
                    <button class="dgq63136-icon-btn" id="dgq63136-btn-close" type="button" title="关闭面板 (Esc)">✕</button>
                </div>
            </div>

            <div class="dgq63136-main-view" id="dgq63136-main-view">
                <div id="dgq63136-update-bar">
                    <span class="dgq63136-update-bar-text" id="dgq63136-update-bar-text">📢 发现新版本</span>
                    <div class="dgq63136-update-bar-actions">
                        <button class="dgq63136-update-now-btn" id="dgq63136-panel-update-now" type="button">一键更新</button>
                        <button class="dgq63136-update-dismiss-btn" id="dgq63136-panel-update-dismiss" type="button" title="暂不提示">✕</button>
                    </div>
                </div>
                <div class="dgq63136-search-area">
                    <input type="text" class="dgq63136-search-input" id="dgq63136-search-input" placeholder="输入关键词搜索..." />
                    <button class="dgq63136-search-btn" id="dgq63136-search-btn" type="button">搜索</button>
                </div>
                <div class="dgq63136-tags-bar" id="dgq63136-tags-bar"></div>
                <div class="dgq63136-list-status" id="dgq63136-list-status">
                    <span>🔥 正在加载最新 50 条烂梗...</span>
                </div>
                <div class="dgq63136-list-container" id="dgq63136-list-container">
                    <div class="dgq63136-list-items" id="dgq63136-list-items"></div>
                    <div class="dgq63136-list-footer" id="dgq63136-list-footer"></div>
                </div>
            </div>

            <div class="dgq63136-sponsor-view" id="dgq63136-sponsor-view">
                <div class="dgq63136-sponsor-top">
                    <button class="dgq63136-back-btn" id="dgq63136-sponsor-back" type="button">← 返回厕纸</button>
                    <div class="dgq63136-sponsor-tabs">
                        <button class="dgq63136-sponsor-tab active" data-channel="wx" type="button">微信赞赏码</button>
                        <button class="dgq63136-sponsor-tab" data-channel="alipay" type="button">支付宝赞赏码</button>
                    </div>
                </div>
                <div class="dgq63136-sponsor-qr-box">
                    <img id="dgq63136-sponsor-qr-img" src="${SPONSOR_WX_QR}" alt="赞赏码" />
                </div>
                <div class="dgq63136-sponsor-desc" id="dgq63136-sponsor-desc">
                    微信扫码赞赏支持 dgq63136厕纸（抖音版），感谢老板充电！
                </div>
                <div class="dgq63136-sponsor-links">
                    <button class="dgq63136-sponsor-open-btn" id="dgq63136-sponsor-open-img" type="button">新窗口查看原图</button>
                    <button class="dgq63136-sponsor-open-btn secondary" id="dgq63136-sponsor-open-web" type="button">访问 dgq63136.cn</button>
                </div>
            </div>
        `;

        ensureInOverlayRoot(panelEl);

        mainViewEl = panelEl.querySelector('#dgq63136-main-view');
        sponsorViewEl = panelEl.querySelector('#dgq63136-sponsor-view');
        sponsorBtnEl = panelEl.querySelector('#dgq63136-btn-sponsor');
        updateBtnEl = panelEl.querySelector('#dgq63136-btn-update');
        updateBarEl = panelEl.querySelector('#dgq63136-update-bar');
        updateBarTextEl = panelEl.querySelector('#dgq63136-update-bar-text');
        listStatusEl = panelEl.querySelector('#dgq63136-list-status');
        listContainerEl = panelEl.querySelector('#dgq63136-list-container');
        listItemsEl = panelEl.querySelector('#dgq63136-list-items');
        listFooterEl = panelEl.querySelector('#dgq63136-list-footer');
        tagsBarEl = panelEl.querySelector('#dgq63136-tags-bar');
        searchInputEl = panelEl.querySelector('#dgq63136-search-input');

        listContainerEl.addEventListener('scroll', checkScrollLoadMore);

        const panelUpdateNowBtn = panelEl.querySelector('#dgq63136-panel-update-now');
        const panelUpdateDismissBtn = panelEl.querySelector('#dgq63136-panel-update-dismiss');
        const searchBtn = panelEl.querySelector('#dgq63136-search-btn');
        const closeBtn = panelEl.querySelector('#dgq63136-btn-close');
        const sponsorBackBtn = panelEl.querySelector('#dgq63136-sponsor-back');
        const sponsorQrImg = panelEl.querySelector('#dgq63136-sponsor-qr-img');
        const sponsorDesc = panelEl.querySelector('#dgq63136-sponsor-desc');
        const sponsorOpenImgBtn = panelEl.querySelector('#dgq63136-sponsor-open-img');
        const sponsorOpenWebBtn = panelEl.querySelector('#dgq63136-sponsor-open-web');
        const sponsorTabs = panelEl.querySelectorAll('.dgq63136-sponsor-tab');

        let currentSponsorUrl = SPONSOR_WX_QR;

        sponsorTabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                sponsorTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const ch = tab.getAttribute('data-channel');
                if (ch === 'alipay') {
                    currentSponsorUrl = SPONSOR_ALIPAY_QR;
                    sponsorDesc.innerText = '支付宝扫码赞赏支持 dgq63136厕纸（抖音版），感谢老板充电！';
                } else {
                    currentSponsorUrl = SPONSOR_WX_QR;
                    sponsorDesc.innerText = '微信扫码赞赏支持 dgq63136厕纸（抖音版），感谢老板充电！';
                }
                sponsorQrImg.src = currentSponsorUrl;
            });
        });

        sponsorQrImg.addEventListener('error', () => {
            sponsorDesc.innerText = '当前页面图片受限，请点击下方「新窗口查看原图」打开赞赏码';
        });

        sponsorOpenImgBtn.addEventListener('click', () => window.open(currentSponsorUrl, '_blank'));
        sponsorOpenWebBtn.addEventListener('click', () => window.open(SPONSOR_HOME_URL, '_blank'));
        sponsorBackBtn.addEventListener('click', switchToMainView);
        sponsorBtnEl.addEventListener('click', toggleSponsorView);
        updateBtnEl.addEventListener('click', () => checkUpdate(true));
        panelUpdateNowBtn.addEventListener('click', triggerOneClickUpdate);
        panelUpdateDismissBtn.addEventListener('click', () => {
            if (updateBarEl) {
                updateBarEl.dataset.dismissed = '1';
                updateBarEl.style.display = 'none';
            }
        });

        panelEl.addEventListener('keydown', (e) => e.stopPropagation());
        panelEl.addEventListener('keyup', (e) => e.stopPropagation());
        panelEl.addEventListener('keypress', (e) => e.stopPropagation());
        panelEl.addEventListener('mousedown', (e) => e.stopPropagation());
        panelEl.addEventListener('click', (e) => e.stopPropagation());

        searchBtn.addEventListener('click', doSearch);
        searchInputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') doSearch();
        });
        closeBtn.addEventListener('click', togglePanel);

        setupDraggable(panelEl, panelEl.querySelector('#dgq63136-panel-header'));
        syncUpdateUIState(false);
        if (tagList.length) renderTagsBar();
        if (!hasLoadedDefaultMemes) {
            loadDefaultMemes('');
        }

        return panelEl;
    }

    function updateListStatus(text, showResetBtn = false) {
        if (!listStatusEl) return;
        listStatusEl.innerHTML = '';
        const span = document.createElement('span');
        span.innerText = text;
        listStatusEl.appendChild(span);

        if (showResetBtn) {
            const btn = document.createElement('button');
            btn.className = 'dgq63136-reset-link';
            btn.type = 'button';
            btn.innerText = '返回最新50条';
            btn.addEventListener('click', () => {
                if (searchInputEl) searchInputEl.value = '';
                activeTagValue = '';
                renderTagsBar();
                loadDefaultMemes('');
            });
            listStatusEl.appendChild(btn);
        }
    }

    function ensureListStructure() {
        if (!listContainerEl) return;
        if (!listItemsEl || !listItemsEl.isConnected) {
            listItemsEl = document.createElement('div');
            listItemsEl.className = 'dgq63136-list-items';
            listItemsEl.id = 'dgq63136-list-items';
            listContainerEl.appendChild(listItemsEl);
        }
        if (!listFooterEl || !listFooterEl.isConnected) {
            listFooterEl = document.createElement('div');
            listFooterEl.className = 'dgq63136-list-footer';
            listFooterEl.id = 'dgq63136-list-footer';
            listContainerEl.appendChild(listFooterEl);
        }
    }

    function buildMemeCard(item) {
        const card = document.createElement('div');
        card.className = 'dgq63136-meme-card';

        const textSpan = document.createElement('span');
        textSpan.className = 'dgq63136-meme-text';
        textSpan.innerText = item.barrage;
        textSpan.title = '点击直接复制此烂梗';
        textSpan.addEventListener('click', () => copyText(item.barrage, item.id));

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'dgq63136-meme-actions';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'dgq63136-btn-copy';
        copyBtn.type = 'button';
        copyBtn.innerText = '复制';
        copyBtn.addEventListener('click', () => copyText(item.barrage, item.id));

        const sendBtn = document.createElement('button');
        sendBtn.className = 'dgq63136-btn-send';
        sendBtn.type = 'button';
        sendBtn.innerText = '发送';
        sendBtn.title = '放入输入框并立即发送';
        sendBtn.addEventListener('click', () => sendBarrage(item.barrage, item.id));

        actionsDiv.appendChild(copyBtn);
        actionsDiv.appendChild(sendBtn);

        card.appendChild(textSpan);
        card.appendChild(actionsDiv);
        return card;
    }

    function renderListFooter(state) {
        ensureListStructure();
        if (!listFooterEl) return;
        listFooterEl.innerHTML = '';

        if (state === 'loading-next') {
            listFooterEl.innerText = '⏳ 正在加载下一页...';
            return;
        }
        if (state === 'error-next') {
            const msg = document.createElement('span');
            msg.innerText = '⚠️ 加载下一页失败，';
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'dgq63136-load-more-btn';
            btn.innerText = '点击重试';
            btn.addEventListener('click', () => loadNextMemePage());
            listFooterEl.appendChild(msg);
            listFooterEl.appendChild(btn);
            return;
        }
        if (state === 'has-more') {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'dgq63136-load-more-btn';
            const progress = currentTotalCount > 0 ? `${loadedMemeList.length} / ${currentTotalCount}` : `${loadedMemeList.length}`;
            btn.innerText = `触底自动加载或点击加载下一页（第 ${currentPageNum} 页 · 已加载 ${progress} 条）`;
            btn.addEventListener('click', () => loadNextMemePage());
            listFooterEl.appendChild(btn);
            return;
        }
        if (state === 'no-more' && loadedMemeList.length > 0) {
            listFooterEl.innerText = `—— 已全部加载（共 ${loadedMemeList.length} 条） ——`;
        }
    }

    function appendMemeCards(items, emptyText, isFirstPage) {
        ensureListStructure();
        if (!listItemsEl) return;

        if (isFirstPage) {
            listItemsEl.innerHTML = '';
            if (listContainerEl) listContainerEl.scrollTop = 0;
        }

        const frag = document.createDocumentFragment();
        (items || []).forEach(item => {
            if (!item || !item.barrage) return;
            const key = item.id !== undefined && item.id !== null ? String(item.id) : item.barrage;
            if (loadedMemeKeys.has(key)) return;
            loadedMemeKeys.add(key);
            loadedMemeList.push(item);
            frag.appendChild(buildMemeCard(item));
        });
        listItemsEl.appendChild(frag);

        if (isFirstPage && loadedMemeList.length === 0) {
            listItemsEl.innerHTML = `<div style="text-align:center;padding:32px 12px;color:#9ca3af;font-size:13px;">${emptyText}</div>`;
        }
    }

    function syncActiveStatusText() {
        const count = loadedMemeList.length;
        const totalSuffix = currentTotalCount > 0 ? ` / ${currentTotalCount}` : '';
        if (listMode === 'search') {
            updateListStatus(`🔍 「${currentSearchKeyword}」已加载 ${count}${totalSuffix} 条`, true);
        } else if (listMode === 'tag') {
            updateListStatus(`🏷️ 「${currentTagLabel}」已加载 ${count}${totalSuffix} 条`, true);
        } else {
            const text = currentPageNum === 1
                ? (currentTotalCount > 0 ? `🔥 默认展示最新 ${count} 条烂梗（共 ${currentTotalCount} 条）` : `🔥 默认展示最新 ${count} 条烂梗`)
                : `🔥 最新烂梗已加载 ${count}${totalSuffix} 条`;
            updateListStatus(text, false);
        }
    }

    function requestCurrentModePage(pageNum) {
        if (listMode === 'search') {
            return searchMemesPage(currentSearchKeyword, pageNum);
        }
        return fetchMemesPage(activeTagValue, pageNum);
    }

    function startListQuery({ mode, tagValue = '', tagLabel = '', keyword = '' }) {
        if (!listContainerEl) return;
        ensureListStructure();
        const reqSeq = ++listRequestSeq;
        listMode = mode;
        activeTagValue = tagValue || '';
        currentTagLabel = tagLabel || '';
        currentSearchKeyword = keyword || '';
        currentPageNum = 1;
        currentTotalCount = 0;
        serverFetchedCount = 0;
        hasMoreMemes = false;
        isLoadingPage = true;
        loadedMemeList = [];
        loadedMemeKeys.clear();

        if (mode === 'search') {
            updateListStatus(`🔍 正在搜索「${keyword}」...`, true);
            listItemsEl.innerHTML = `<div style="text-align:center;padding:30px;color:#9ca3af;font-size:13px;">🔍 正在检索烂梗中...</div>`;
        } else if (mode === 'tag') {
            updateListStatus(`🏷️ 正在加载「${tagLabel}」最新 ${DEFAULT_PAGE_SIZE} 条...`, true);
            listItemsEl.innerHTML = `<div style="text-align:center;padding:30px;color:#9ca3af;font-size:13px;">⏳ 正在拉取最新烂梗列表...</div>`;
        } else {
            updateListStatus(`🔥 正在加载最新 ${DEFAULT_PAGE_SIZE} 条烂梗...`, false);
            listItemsEl.innerHTML = `<div style="text-align:center;padding:30px;color:#9ca3af;font-size:13px;">⏳ 正在拉取最新烂梗列表...</div>`;
        }
        renderListFooter('loading-first');
        listContainerEl.scrollTop = 0;

        requestCurrentModePage(1)
            .then(({ list, total, isLastPage }) => {
                if (reqSeq !== listRequestSeq) return;
                isLoadingPage = false;
                currentTotalCount = total;
                serverFetchedCount = list.length;
                hasMoreMemes =
                    list.length > 0 &&
                    !isLastPage &&
                    (total > 0 ? serverFetchedCount < total : list.length >= DEFAULT_PAGE_SIZE);

                const emptyMsg = mode === 'search'
                    ? `未找到与「${keyword}」相关的弹幕，换个词试试吧~`
                    : '暂无烂梗数据';
                appendMemeCards(list, emptyMsg, true);
                syncActiveStatusText();
                renderListFooter(hasMoreMemes ? 'has-more' : 'no-more');
            })
            .catch(() => {
                if (reqSeq !== listRequestSeq) return;
                isLoadingPage = false;
                hasMoreMemes = false;
                if (mode === 'search') {
                    updateListStatus(`⚠️ 搜索「${keyword}」失败`, true);
                    appendMemeCards([], '请求失败，请检查网络连接后重试', true);
                } else {
                    updateListStatus('⚠️ 拉取最新烂梗失败，请稍后重试', Boolean(tagValue));
                    appendMemeCards([], '加载失败，请检查网络或重新打开面板重试', true);
                }
                renderListFooter('error-first');
            });
    }

    function loadNextMemePage() {
        if (isLoadingPage || !hasMoreMemes) return;
        const reqSeq = listRequestSeq;
        const targetPage = currentPageNum + 1;
        isLoadingPage = true;
        renderListFooter('loading-next');

        requestCurrentModePage(targetPage)
            .then(({ list, total, isLastPage }) => {
                if (reqSeq !== listRequestSeq) return;
                isLoadingPage = false;
                currentPageNum = targetPage;
                if (total > 0) currentTotalCount = total;
                serverFetchedCount += list.length;
                hasMoreMemes =
                    list.length > 0 &&
                    !isLastPage &&
                    (currentTotalCount > 0 ? serverFetchedCount < currentTotalCount : list.length >= DEFAULT_PAGE_SIZE);

                if (list.length > 0) {
                    appendMemeCards(list, '', false);
                    syncActiveStatusText();
                }
                renderListFooter(hasMoreMemes ? 'has-more' : 'no-more');
            })
            .catch(() => {
                if (reqSeq !== listRequestSeq) return;
                isLoadingPage = false;
                renderListFooter('error-next');
            });
    }

    function checkScrollLoadMore() {
        if (!listContainerEl || !hasMoreMemes || isLoadingPage) return;
        if (!panelEl || panelEl.style.display !== 'flex') return;
        if (sponsorViewEl && sponsorViewEl.style.display === 'flex') return;
        const { scrollTop, clientHeight, scrollHeight } = listContainerEl;
        if (clientHeight <= 0 || scrollHeight <= clientHeight) return;
        if (scrollTop + clientHeight >= scrollHeight - 60) {
            loadNextMemePage();
        }
    }

    function loadDefaultMemes(tagValue = '', tagLabel = '') {
        hasLoadedDefaultMemes = true;
        if (tagValue) {
            startListQuery({ mode: 'tag', tagValue, tagLabel: tagLabel || tagValue });
        } else {
            startListQuery({ mode: 'default' });
        }
    }

    function renderTagsBar() {
        if (!tagsBarEl || !tagList.length) return;
        tagsBarEl.innerHTML = '';
        tagList.slice(0, 12).forEach(item => {
            const tagBtn = document.createElement('span');
            const val = String(item.dictValue || item.dictLabel || '').trim();
            const label = item.dictLabel || val;
            tagBtn.className = 'dgq63136-tag-item' + (activeTagValue && activeTagValue === val ? ' active' : '');
            tagBtn.innerText = label;
            tagBtn.addEventListener('click', () => {
                if (searchInputEl) searchInputEl.value = '';
                if (activeTagValue === val) {
                    activeTagValue = '';
                    renderTagsBar();
                    loadDefaultMemes('');
                } else {
                    activeTagValue = val;
                    renderTagsBar();
                    loadDefaultMemes(val, label);
                }
            });
            tagsBarEl.appendChild(tagBtn);
        });
    }

    function doSearch() {
        if (!searchInputEl) return;
        const query = searchInputEl.value.trim();
        if (!query) {
            activeTagValue = '';
            renderTagsBar();
            loadDefaultMemes('');
            return;
        }

        activeTagValue = '';
        renderTagsBar();
        startListQuery({ mode: 'search', keyword: query });
    }

    function togglePanel(e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        const panel = createPanel();
        ensureInOverlayRoot(panel);

        if (panel.style.display === 'flex') {
            panel.style.display = 'none';
        } else {
            switchToMainView();
            panel.style.display = 'flex';
            if (!hasLoadedDefaultMemes) {
                loadDefaultMemes('');
            }
            const rect = panel.getBoundingClientRect();
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            if (rect.right > vw || rect.left < 0 || rect.bottom > vh || rect.top < 0) {
                panel.style.left = `${Math.max(12, Math.min(vw - panel.offsetWidth - 20, vw - 468))}px`;
                panel.style.top = `${Math.max(12, Math.min(vh - panel.offsetHeight - 20, 90))}px`;
                panel.style.right = 'auto';
            }
            if (searchInputEl) {
                setTimeout(() => searchInputEl.focus(), 60);
            }
        }
    }

    function setupDraggable(target, handle, onDragStateChange) {
        let isDragging = false;
        let hasMoved = false;
        let startX, startY, origX, origY;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.closest('button') && handle !== target) return;
            isDragging = true;
            hasMoved = false;
            startX = e.clientX;
            startY = e.clientY;
            const rect = target.getBoundingClientRect();
            origX = rect.left;
            origY = rect.top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.hypot(dx, dy) > 4) {
                hasMoved = true;
            }
            target.style.left = `${Math.max(8, Math.min(window.innerWidth - target.offsetWidth - 8, origX + dx))}px`;
            target.style.top = `${Math.max(8, Math.min(window.innerHeight - target.offsetHeight - 8, origY + dy))}px`;
            target.style.right = 'auto';
            target.style.bottom = 'auto';
        }

        function onMouseUp() {
            isDragging = false;
            if (onDragStateChange) onDragStateChange(hasMoved);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    function mountIconButtons() {
        let ball = document.getElementById('dgq63136-douyin-ball');
        if (!ball) {
            ball = document.createElement('div');
            ball.id = 'dgq63136-douyin-ball';
            ball.title = 'dgq63136厕纸（抖音版）(点击打开/关闭厕纸面板)';
            if (document.getElementById('sb6657-douyin-ball')) {
                ball.style.bottom = '192px';
            }
            ball.innerHTML = `
                <img src="${BRAND_ICON_URL}" alt="dgq63136" />
                <span class="pulse-badge"></span>
            `;
            let skipNextClick = false;
            setupDraggable(ball, ball, (moved) => {
                skipNextClick = moved;
                if (moved) {
                    setTimeout(() => { skipNextClick = false; }, 120);
                }
            });
            ball.addEventListener('mousedown', (e) => e.stopPropagation());
            ball.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (skipNextClick) return;
                togglePanel(e);
            });
        }
        ensureInOverlayRoot(ball);
        syncUpdateUIState(false);

        const controlsRights = document.querySelectorAll('.douyin-player-controls-right');
        controlsRights.forEach((controlsRight) => {
            if (controlsRight.querySelector('.dgq63136-ctrl-slot')) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'dgq63136-ctrl-slot';

            const btn = document.createElement('button');
            btn.className = 'dgq63136-toolbar-btn';
            btn.type = 'button';
            btn.innerHTML = `<img src="${BRAND_ICON_URL}" /><span>厕纸</span>`;
            btn.title = '打开 dgq63136厕纸（抖音版）面板';

            const blockBubble = (e) => {
                e.stopPropagation();
            };
            btn.addEventListener('pointerdown', blockBubble);
            btn.addEventListener('mousedown', blockBubble);
            btn.addEventListener('mouseup', blockBubble);
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                togglePanel(e);
            });

            wrapper.appendChild(btn);

            const qualityEl = controlsRight.querySelector('.QualitySwitchNewPlugin');
            const qualitySlot = qualityEl ? qualityEl.closest('slot') || qualityEl : null;
            if (qualitySlot && qualitySlot.parentElement === controlsRight) {
                controlsRight.insertBefore(wrapper, qualitySlot.nextSibling);
            } else {
                controlsRight.appendChild(wrapper);
            }
        });
    }

    document.addEventListener('fullscreenchange', () => {
        ensureInOverlayRoot(document.getElementById('dgq63136-douyin-ball'));
        ensureInOverlayRoot(document.getElementById('dgq63136-panel'));
        ensureInOverlayRoot(document.getElementById('dgq63136-toast'));
        ensureInOverlayRoot(document.getElementById('dgq63136-update-banner'));
        ensureInOverlayRoot(document.getElementById('dgq63136-danmu-highlight-box'));
        ensureInOverlayRoot(document.getElementById('dgq63136-danmu-actions'));
    });

    function extractSenderFromMsgPayload(msg) {
        const u = msg?.payload?.user;
        if (!u || typeof u !== 'object') return '';
        return normalizeSingleLineText(u.nickname || u.desensitized_nickname || u.display_id || u.short_id || u.id_str || u.id || '');
    }

    function extractTextFromMsgPayload(msg) {
        const payload = msg?.payload;
        if (!payload) return '';
        if (payload.content && (!payload.rtf_content_v2 || !Array.isArray(payload.rtf_content_v2.pieces))) {
            return normalizeSingleLineText(payload.content);
        }
        if (payload.rtf_content_v2 && Array.isArray(payload.rtf_content_v2.pieces)) {
            let text = '';
            payload.rtf_content_v2.pieces.forEach(p => {
                if (p.string_value) {
                    text += p.string_value;
                } else if (p.image_value) {
                    const url = p.image_value?.image?.url_list?.[0];
                    if (url && emojiUrlToNameMap.has(url)) {
                        text += emojiUrlToNameMap.get(url);
                    }
                } else if (p.user_value && p.user_value.user) {
                    text += `${p.user_value.left_additional_content || ''}${p.user_value.user.nickname || ''}${p.user_value.right_additional_content || ''}`;
                }
            });
            if (text) return normalizeSingleLineText(text);
        }
        return normalizeSingleLineText(payload.content || '');
    }

    function findSenderFromChatDom(text) {
        if (!text) return '';
        try {
            const chatroom = document.getElementById('chatroom');
            if (!chatroom) return '';
            const items = chatroom.querySelectorAll('.webcast-chatroom___item, [data-danmu-id]');
            for (let i = items.length - 1; i >= 0; i--) {
                const el = items[i];
                const raw = (el.innerText || '').trim();
                if (!raw || !raw.includes(text)) continue;

                const fk = Object.keys(el).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
                if (fk) {
                    let f = el[fk];
                    let steps = 0;
                    while (f && steps < 6) {
                        const msg = f.memoizedProps?.message || f.memoizedProps?.item || f.memoizedProps?.data;
                        const s = msg?.payload?.user?.nickname || msg?.payload?.user?.desensitized_nickname;
                        if (s) return normalizeSingleLineText(s);
                        f = f.return;
                        steps++;
                    }
                }

                const clean = raw.replace(/\s+/g, ' ').trim();
                const pos = clean.lastIndexOf(text);
                if (pos > 0) {
                    const before = clean.slice(0, pos).replace(/[：:]\s*$/, '').trim();
                    const tokens = before.split(' ').filter(Boolean);
                    const lastToken = tokens[tokens.length - 1] || '';
                    if (lastToken && !/^\d+$/.test(lastToken)) {
                        return normalizeSingleLineText(lastToken);
                    }
                }
            }
        } catch (e) {}
        return '';
    }

    function extractBarrageInfo(options) {
        if (!options) return null;

        if (options.id) {
            const rawId = String(options.id);
            if (msgMetaMap.has(rawId)) {
                return msgMetaMap.get(rawId);
            }
            if (rawId.length > 15) {
                const maybePrefix = rawId.slice(0, rawId.length - 13);
                if (msgMetaMap.has(maybePrefix)) {
                    return msgMetaMap.get(maybePrefix);
                }
            }
        }

        if (options.color === '#ff4471') return null;

        const pieces = [];
        function walk(node) {
            if (!node) return;
            if (Array.isArray(node)) {
                node.forEach(walk);
                return;
            }
            if (node.type === 'text' && node.text) {
                pieces.push(node.text);
            } else if (node.type === 'image' && node.src && emojiUrlToNameMap.has(node.src)) {
                pieces.push(emojiUrlToNameMap.get(node.src));
            } else if (Array.isArray(node.content)) {
                walk(node.content);
            }
        }
        walk(options.content);

        let text = normalizeSingleLineText(pieces.join(''));
        if (!text) return null;

        let sender = '';
        const firstTextNode = Array.isArray(options.content)
            ? (options.content[0]?.type === 'text' ? options.content[0].text : options.content[0]?.content?.[0]?.text)
            : '';
        if (typeof firstTextNode === 'string' && /:\s{2}$/.test(firstTextNode)) {
            sender = normalizeSingleLineText(firstTextNode.replace(/:\s{2}$/, ''));
            if (text.startsWith(firstTextNode.trim())) {
                text = normalizeSingleLineText(text.slice(firstTextNode.trim().length));
            }
        }

        if (text.startsWith('管理') && Array.isArray(options.content) && options.content[0]?.content?.[0]?.text === '管理') {
            text = normalizeSingleLineText(text.slice(2));
        }

        if (!text) return null;
        if (!sender) {
            sender = findSenderFromChatDom(text);
        }
        return { text: normalizeSingleLineText(text), sender: normalizeSingleLineText(sender) };
    }

    function hookDanmuMessageStore() {
        const tryHook = () => {
            const cps = document.querySelectorAll('.CanvasDanmakuPlugin');
            let hookedAny = false;
            for (const cp of cps) {
                const fk = Object.keys(cp).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
                if (!fk) continue;
                let fiber = cp[fk];
                let store = null;
                let steps = 0;
                while (fiber && steps < 10) {
                    if (fiber.memoizedProps && fiber.memoizedProps.store) {
                        store = fiber.memoizedProps.store;
                        break;
                    }
                    fiber = fiber.return;
                    steps++;
                }
                if (!store) continue;

                if (!emojiReverseReady && store.roomStore && store.roomStore.emojiReflex) {
                    emojiReverseReady = true;
                    const reflex = store.roomStore.emojiReflex;
                    Object.keys(reflex).forEach(k => {
                        if (reflex[k]) emojiUrlToNameMap.set(reflex[k], k);
                    });
                }

                const msgBus = store.singletonStore && store.singletonStore.message;
                if (msgBus && !msgBus._dgq63136_msg_mapped) {
                    msgBus._dgq63136_msg_mapped = true;
                    const recordList = (list) => {
                        if (!Array.isArray(list)) return;
                        list.forEach(m => {
                            if (!m || !m.msg_id) return;
                            const txt = extractTextFromMsgPayload(m);
                            const sender = extractSenderFromMsgPayload(m);
                            if (txt) {
                                msgMetaMap.set(String(m.msg_id), { text: txt, sender });
                                if (msgMetaMap.size > 800) {
                                    const firstKey = msgMetaMap.keys().next().value;
                                    msgMetaMap.delete(firstKey);
                                }
                            }
                        });
                    };
                    msgBus.on('ChatMessage', recordList);
                    msgBus.on('ScreenChatMessage', recordList);
                    msgBus.on('PrivilegeScreenChatMessage', recordList);
                }
                if (msgBus && msgBus._dgq63136_msg_mapped) {
                    hookedAny = true;
                }
            }
            return hookedAny;
        };

        if (!tryHook()) {
            const timer = setInterval(() => {
                if (tryHook()) clearInterval(timer);
            }, 250);
        }
    }

    let highlightBoxEl = null;
    let danmuActionsEl = null;
    let activePausedBarrage = null;
    let activeChannelIdx = -1;
    let activeText = '';
    let activeSender = '';
    let activeCanvasEl = null;
    let activeInstance = null;
    let lastMouseX = -9999;
    let lastMouseY = -9999;
    let rafTrackId = null;

    function getHighlightBox() {
        if (!highlightBoxEl) {
            highlightBoxEl = document.createElement('div');
            highlightBoxEl.id = 'dgq63136-danmu-highlight-box';
        }
        ensureInOverlayRoot(highlightBoxEl);
        return highlightBoxEl;
    }

    function getDanmuActionsBar() {
        if (!danmuActionsEl) {
            danmuActionsEl = document.createElement('div');
            danmuActionsEl.id = 'dgq63136-danmu-actions';

            const plus1Btn = document.createElement('button');
            plus1Btn.id = 'dgq63136-plus1-btn';
            plus1Btn.className = 'dgq63136-danmu-action-btn';
            plus1Btn.type = 'button';
            plus1Btn.innerText = '+1';
            plus1Btn.title = '立即发送这条弹幕 (+1)';

            const replyBtn = document.createElement('button');
            replyBtn.id = 'dgq63136-reply-btn';
            replyBtn.className = 'dgq63136-danmu-action-btn';
            replyBtn.type = 'button';
            replyBtn.innerText = '回复';
            replyBtn.title = '填入 @发送者ID：发送内容 到聊天框';

            const stopEvt = (e) => e.stopPropagation();
            danmuActionsEl.addEventListener('pointerdown', stopEvt);
            danmuActionsEl.addEventListener('mousedown', stopEvt);
            danmuActionsEl.addEventListener('mouseup', stopEvt);
            danmuActionsEl.addEventListener('click', stopEvt);

            plus1Btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const text = activeText;
                unlockPausedBarrage();
                if (text) {
                    sendBarrage(text);
                }
            });

            replyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const sender = activeSender;
                const text = activeText;
                unlockPausedBarrage();
                if (text) {
                    fillReplyToChatInput(sender, text);
                }
            });

            danmuActionsEl.addEventListener('mouseleave', () => {
                setTimeout(() => checkPointerStillOverActive(), 40);
            });

            danmuActionsEl.appendChild(plus1Btn);
            danmuActionsEl.appendChild(replyBtn);
        }
        ensureInOverlayRoot(danmuActionsEl);
        return danmuActionsEl;
    }

    function findMainThreadDanmakuManager() {
        const cps = document.querySelectorAll('.CanvasDanmakuPlugin');
        for (const cp of cps) {
            const canvas = cp.querySelector('canvas');
            if (canvas) {
                const r = canvas.getBoundingClientRect();
                if (r.width === 0 || r.height === 0) continue;
            }
            const fk = Object.keys(cp).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
            if (!fk) continue;
            const compFiber = cp[fk]?.return;
            let st = compFiber?.memoizedState;
            while (st) {
                const val = st.memoizedState;
                if (val && typeof val === 'object' && 'current' in val && val.current && val.current.danmakuManagerInMainThread) {
                    return val.current;
                }
                st = st.next;
            }
        }
        return null;
    }

    function ensureBarrageProtoHooked(barrage) {
        if (!barrage) return;
        const proto = Object.getPrototypeOf(barrage);
        if (proto && !proto._dgq63136_move_hooked) {
            proto._dgq63136_move_hooked = true;
            const origMove = proto.move;
            proto.move = function () {
                if (this._dgq63136_paused) {
                    return;
                }
                return origMove.apply(this, arguments);
            };
        }
    }

    function getBarrageScreenRect(barrage, chIdx, inst, canvas) {
        if (!barrage || !inst || !canvas) return null;
        const canvasRect = canvas.getBoundingClientRect();
        if (!canvasRect.width || !canvasRect.height || !canvas.width || !canvas.height) return null;

        const scaleX = canvasRect.width / canvas.width;
        const scaleY = canvasRect.height / canvas.height;
        const pxLeft = canvas.width - barrage.deltaX;
        const pxTop = chIdx * inst.channelHeightDpr + 2;
        const pxW = barrage.size?.widthWithDpr || 0;
        const pxH = barrage.size?.heightWithDpr || 0;
        if (!pxW || !pxH) return null;

        return {
            left: canvasRect.left + pxLeft * scaleX,
            top: canvasRect.top + pxTop * scaleY,
            width: pxW * scaleX,
            height: pxH * scaleY,
            canvasRect
        };
    }

    function positionOverlayForBarrage(rect) {
        const box = getHighlightBox();
        const bar = getDanmuActionsBar();

        box.style.left = `${rect.left - 3}px`;
        box.style.top = `${rect.top - 2}px`;
        box.style.width = `${rect.width + 6}px`;
        box.style.height = `${rect.height + 4}px`;
        box.style.display = 'block';

        bar.style.display = 'inline-flex';
        const barHeight = bar.offsetHeight || 28;
        const barWidth = bar.offsetWidth || 98;

        let barLeft = rect.left + rect.width + 6;
        let barTop = rect.top + (rect.height - barHeight) / 2;

        if (barLeft + barWidth > rect.canvasRect.right - 8) {
            barLeft = Math.max(rect.canvasRect.left + 8, rect.left - barWidth - 6);
        }
        if (barTop < 6) {
            barTop = rect.top + rect.height + 4;
        }

        bar.style.left = `${barLeft}px`;
        bar.style.top = `${barTop}px`;
    }

    function lockBarrage(barrage, chIdx, info, inst, canvas, rect) {
        if (activePausedBarrage && activePausedBarrage !== barrage) {
            activePausedBarrage._dgq63136_paused = false;
        }
        ensureBarrageProtoHooked(barrage);
        barrage._dgq63136_paused = true;

        activePausedBarrage = barrage;
        activeChannelIdx = chIdx;
        activeText = info.text;
        activeSender = info.sender || '';
        activeInstance = inst;
        activeCanvasEl = canvas;

        positionOverlayForBarrage(rect);
        startOverlaySyncLoop();
    }

    function unlockPausedBarrage() {
        if (activePausedBarrage) {
            activePausedBarrage._dgq63136_paused = false;
            activePausedBarrage = null;
        }
        activeChannelIdx = -1;
        activeText = '';
        activeSender = '';
        if (highlightBoxEl) highlightBoxEl.style.display = 'none';
        if (danmuActionsEl) danmuActionsEl.style.display = 'none';
        if (rafTrackId) {
            cancelAnimationFrame(rafTrackId);
            rafTrackId = null;
        }
    }

    function startOverlaySyncLoop() {
        if (rafTrackId) return;
        const tick = () => {
            rafTrackId = null;
            if (!activePausedBarrage || !activeInstance || !activeCanvasEl) {
                unlockPausedBarrage();
                return;
            }
            if (activePausedBarrage.isExpired || !activePausedBarrage.bookedChannel) {
                unlockPausedBarrage();
                return;
            }
            const rect = getBarrageScreenRect(activePausedBarrage, activeChannelIdx, activeInstance, activeCanvasEl);
            if (!rect) {
                unlockPausedBarrage();
                return;
            }
            positionOverlayForBarrage(rect);
            rafTrackId = requestAnimationFrame(tick);
        };
        rafTrackId = requestAnimationFrame(tick);
    }

    function isPointInSafeActiveUnion(x, y) {
        if (!activePausedBarrage || !activeInstance || !activeCanvasEl) return false;
        const rect = getBarrageScreenRect(activePausedBarrage, activeChannelIdx, activeInstance, activeCanvasEl);
        if (!rect) return false;

        const inBarrage =
            x >= rect.left - 6 &&
            x <= rect.left + rect.width + 6 &&
            y >= rect.top - 6 &&
            y <= rect.top + rect.height + 6;
        if (inBarrage) return true;

        if (danmuActionsEl && danmuActionsEl.style.display !== 'none') {
            const br = danmuActionsEl.getBoundingClientRect();
            const unionLeft = Math.min(rect.left, br.left) - 4;
            const unionRight = Math.max(rect.left + rect.width, br.right) + 6;
            const unionTop = Math.min(rect.top, br.top) - 4;
            const unionBottom = Math.max(rect.top + rect.height, br.bottom) + 4;
            if (x >= unionLeft && x <= unionRight && y >= unionTop && y <= unionBottom) {
                return true;
            }
        }
        return false;
    }

    function checkPointerStillOverActive() {
        if (!activePausedBarrage) return;
        if (!isPointInSafeActiveUnion(lastMouseX, lastMouseY)) {
            unlockPausedBarrage();
        }
    }

    function handleCanvasDanmuMouseMove(x, y, targetEl) {
        lastMouseX = x;
        lastMouseY = y;

        if (targetEl && (
            targetEl.closest('#dgq63136-panel') ||
            targetEl.closest('#dgq63136-douyin-ball') ||
            targetEl.closest('#dgq63136-update-banner') ||
            targetEl.closest('.dgq63136-ctrl-slot') ||
            targetEl.closest('#sb6657-panel') ||
            targetEl.closest('#sb6657-douyin-ball') ||
            targetEl.closest('#sb6657-update-banner') ||
            targetEl.closest('.sb6657-ctrl-slot') ||
            targetEl.closest('.douyin-player-controls')
        )) {
            if (activePausedBarrage) unlockPausedBarrage();
            return;
        }

        if (activePausedBarrage && isPointInSafeActiveUnion(x, y)) {
            return;
        }

        const manager = findMainThreadDanmakuManager();
        const inst = manager?.danmakuManagerInMainThread?.instance;
        const canvas = manager?.canvasDom;

        if (!inst || !canvas) {
            if (activePausedBarrage) unlockPausedBarrage();
            return;
        }

        const canvasRect = canvas.getBoundingClientRect();
        if (x < canvasRect.left || x > canvasRect.right || y < canvasRect.top || y > canvasRect.bottom) {
            if (activePausedBarrage) unlockPausedBarrage();
            return;
        }

        const channels = inst._channels || inst.channels || [];
        for (let chIdx = 0; chIdx < channels.length; chIdx++) {
            const ch = channels[chIdx];
            if (!Array.isArray(ch)) continue;
            for (let i = 0; i < ch.length; i++) {
                const b = ch[i];
                if (!b || (b.needDraw && !b.needDraw(chIdx))) continue;
                const rect = getBarrageScreenRect(b, chIdx, inst, canvas);
                if (!rect) continue;

                if (
                    x >= rect.left - 4 &&
                    x <= rect.left + rect.width + 4 &&
                    y >= rect.top - 4 &&
                    y <= rect.top + rect.height + 4
                ) {
                    const info = extractBarrageInfo(b.options);
                    if (!info || !info.text) continue;

                    lockBarrage(b, chIdx, info, inst, canvas, rect);
                    return;
                }
            }
        }

        if (activePausedBarrage) {
            unlockPausedBarrage();
        }
    }

    function bindNativeDomDanmuHover(el, text) {
        if (!el || el._dgq63136_dom_bound || !text) return;
        el._dgq63136_dom_bound = true;

        el.addEventListener('mouseenter', () => {
            el.style.animationPlayState = 'paused';
            el.style.transition = 'none';
            const rect = el.getBoundingClientRect();
            const bar = getDanmuActionsBar();
            bar.style.display = 'inline-flex';
            const barWidth = bar.offsetWidth || 98;
            bar.style.left = `${Math.min(window.innerWidth - barWidth - 10, rect.right + 6)}px`;
            bar.style.top = `${Math.max(6, rect.top + (rect.height - 28) / 2)}px`;
            activeText = text;
            activeSender = findSenderFromChatDom(text);
        });

        el.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!danmuActionsEl || !danmuActionsEl.matches(':hover')) {
                    el.style.animationPlayState = 'running';
                    if (danmuActionsEl) danmuActionsEl.style.display = 'none';
                }
            }, 120);
        });
    }

    function observeNativeDomFallback() {
        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.classList && (
                        node.classList.contains('XdO7mq0W') ||
                        node.classList.contains('BIDz2ikw') ||
                        node.classList.contains('SF8xNeY5') ||
                        node.hasAttribute('data-danmu-id')
                    )) {
                        const text = node.innerText?.trim();
                        if (text) bindNativeDomDanmuHover(node, text);
                    }
                }
            }
        });
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    document.addEventListener('mousemove', (e) => {
        handleCanvasDanmuMouseMove(e.clientX, e.clientY, e.target);
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (panelEl && panelEl.style.display === 'flex') {
                panelEl.style.display = 'none';
            }
            unlockPausedBarrage();
        }
    });

    function init() {
        fetchDictTags();
        mountIconButtons();
        hookDanmuMessageStore();
        observeNativeDomFallback();

        setTimeout(() => {
            checkUpdate(false);
        }, 1500);

        setInterval(() => {
            mountIconButtons();
        }, 1500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
