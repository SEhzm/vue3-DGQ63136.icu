# DGQ63136.cn 前端源码

斗鱼 63136 弹幕库网站前端，包含首页、弹幕库浏览、一键安装插件页面和相关静态资源。

## 线上地址

- 网站入口：https://dgq63136.cn/
- 一键安装插件页：https://dgq63136.cn/#/Tampermonkey
- 插件安装源（脚本头部 `@downloadURL` / `@updateURL` 指向）：https://dgq63136.cn/dgq63136.user.js
- 安装提醒：有些浏览器即使装好 Tampermonkey，也要手动打开“允许用户脚本”，否则插件不会运行。

## 目录说明

```text
.
├── .github/workflows/        # GitHub Pages 自动部署
├── docs/                     # 项目说明、更新日志、油猴脚本文档
├── public/                   # 静态资源（含油猴脚本 dgq63136.user.js 的单一真实源，构建后随 dist 一起部署）
├── src/                      # Vue3 前端源码
├── tools/                    # 安装页静态验证脚本
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

插件交付物的单一真实源是 `public/dgq63136.user.js`，Vite 构建时会复制到 `dist/` 根目录，部署到 GitHub Pages 后即可通过 `https://dgq63136.cn/dgq63136.user.js` 直接下载。脚本头部 `@downloadURL` / `@updateURL` 与运行时更新检查的 `UPDATE_SOURCE_URL` / `UPDATE_SCRIPT_URL` 都已统一指向站内同源地址，油猴管理器会按 `@updateURL` 间隔去拉取最新脚本，运行时也会从同一个 URL 主动检查新版本。网站仓库不再保存插件源码 zip 或页面源码 zip。本地编辑器目录 `.idea/`、`node_modules/`、`dist/` 和临时 zip 不提交到仓库。

## 本地开发

```powershell
npm install
npm run dev
```

## 验证和构建

```powershell
npm run verify
```

`npm run verify` 会先检查一键安装插件页面的版本号、安装链接、更新历史和签名规则，再执行 Vite 构建。

## 当前插件页版本

- 当前展示版本：`V0.2.16`
- 更新时间：`2026-08-15 21:29`
- 更新历史署名规则：用户本人更新只写单独一行 `@呆物麋羊`，不要写成 `@呆物麋羊 更新`。
- 安装教程：一键安装页已包含从浏览器扩展管理页进入 Tampermonkey 详细信息、开启“允许用户脚本 / Allow user scripts”和“在 InPrivate 中允许”两个开关、回到本页安装插件、安装后确认“厕纸”按钮的完整流程。

## 安全说明

本仓库是公开前端源码仓库，不提交 Cookie、token、CDN 密钥、后台账号、日志、缓存、浏览器会话或任何私人配置。`.env.development` 和 `.env.production` 只包含公开访问地址和开发代理配置。
## 验证和构建

```powershell
npm run verify
```

`npm run verify` 会先检查一键安装插件页面的版本号、安装链接、更新历史和签名规则，再执行 Vite 构建。

## 当前插件页版本

- 当前展示版本：`V0.2.8`
- 更新时间：`2026-08-14 15:57`
- 更新历史署名规则：用户本人更新只写单独一行 `@呆物麋羊`，不要写成 `@呆物麋羊 更新`。
- 安装教程：一键安装页已包含从浏览器扩展管理页进入 Tampermonkey 详细信息、开启“允许用户脚本 / Allow user scripts”和“在 InPrivate 中允许”两个开关、回到本页安装插件、安装后确认“厕纸”按钮的完整流程。

## 安全说明

本仓库是公开前端源码仓库，不提交 Cookie、token、CDN 密钥、后台账号、日志、缓存、浏览器会话或任何私人配置。`.env.development` 和 `.env.production` 只包含公开访问地址和开发代理配置。
