# DGQ63136.cn 功能迁移完成报告

**完成时间：** 2026-08-12
**源项目：** `frontend/`（sb6657.cn）
**目标项目：** `DGQ63136.cn/`
**后端：** `backend/sb6657-machine/` → `backend/sb6657-dgq/`

## 范围

将 frontend 项目（sb6657.cn）的所有功能（**排除**：赛事库 / 赛事烂梗库 / 屏蔽词 / 15勇士 / 超级逮虾户战报 / 年度TOP20 / 赛事竞猜）迁移到 DGQ63136.cn，包括：

- 前端所有页面、组件、状态、工具、API、样式、架构
- 后端 machine 模块的对应 Controller / Service / Entity / Mapper
- 配套 SQL DDL / 索引 / 数据迁移脚本

## 已迁移功能清单

### 前端路由（13 个新页面）

| 路由 | 来源 frontend | 用途 |
|---|---|---|
| `/post-bar` | post-bar-main.vue | 社区贴吧 |
| `/me-post` | post-bar/Me-Post.vue | 我的帖子 |
| `/me-msg` | post-bar/Post-Message.vue | 系统消息 |
| `/UserInfo` | user/components/index.vue | 个人中心 |
| `/me-memes` | user/components/Me-memes.vue | 我点赞的烂梗 |
| `/aichat` | AiGenerateMemes/AIChat.vue | AI 造梗（SSE 流式） |
| `/update` | update-timeline.vue | 网站更新日志 |
| `/stale` | stale-hot/stale.vue | 烂度榜 |
| `/hotwall` | stale-hot/hotwall.vue | 实时热度墙（SSE） |
| `/arena` | play/arena.vue | 烂梗擂台 |
| `/growth` | play/growth.vue | 用户成长 / 勋章 / 排行榜 |
| `/lifecycle` | keep/lifecycle.vue | 梗生命周期 & DNA v6 关联图谱 |
| `/checkin` | keep/checkin.vue | 签到 + 梗币 + 打赏 |

### 保留的 DGQ 原版路由

| 路由 | 用途 |
|---|---|
| `/home` | 首页（含随机烂梗 + 搜索 + 投稿，整合了 HomeIntro / DidYouKnow / RandomMeme 子组件） |
| `/memes/:category` | 全部 / 喷冬瓜强 / 喷超哥 / 警钟长鸣 / QUQU 等分栏 |
| `/image` | 时光相册（TimeAlbum / AlbumGallery / AlbumPhotoCard） |
| `/Tampermonkey` | 一键安装插件页（DGQ 原版，verify-install-page 校验） |
| `/ChatRoom` | 直播间聊天室 |
| `/Starrysky` | 星空背景 |
| `/audioPlayer` | 背景 BGM 播放器 |
| `/test` / `/test2` | Element Plus 演示 + 调查问卷 |

### 新增组件（37 个）

**全局组件** (`src/components/`)
- AnnouncementDialog.vue - 公告弹窗
- ThemeSwitcher.vue / ThemeDropdown.vue - 主题切换（明/暗/跟随系统）
- desktop-sidebar.vue / mobile-top-tabs.vue - 桌面侧栏 + 移动 Tab
- search-dialog.vue / search-dialog-host.vue - 搜索弹窗（高级筛选）
- global-dialog-host.vue - 全局弹窗宿主
- tag-selector.vue - 标签选择器
- wordCloud.vue - 词云（echarts-wordcloud）
- meme-submission.vue - 烂梗投稿
- CoinPreviewDialog.vue - 硬币预览（赛事币 3D 模型）

**首页子组件** (`src/components/home/`)
- homeIntro.vue - 站点介绍（DGQ 文案）
- didYouKnow.vue - 你知道吗 + 最新烂梗 + 标签云
- random-meme.vue - 随机烂梗卡片

**合成猪游戏** (`src/components/MergePig/`)
- MergePigDialog.vue - 物理合成游戏弹窗（matter-js）
- MergePigLauncher.vue - 启动按钮
- native/game.js / style.css / wsClient.js / config.js - 物理引擎与 WS 客户端

**时光相册** (`src/components/TimeAlbum/`)
- AlbumGallery.vue - 相册列表
- AlbumPhotoCard.vue - 单张照片卡片
- AlbumCommentDialog.vue - 评论弹窗

**贴吧** (`src/views/MainLayout/components/post-bar/`)
- post-bar-main.vue - 帖子流
- Me-Post.vue - 我的帖子
- Post-Message.vue - 系统消息
- sendPost.vue - 发帖（含 AI 审核提交）
- CommentList.vue / CommentItem.vue - 评论列表

**用户中心** (`src/views/MainLayout/components/user/components/`)
- index.vue - 个人中心入口
- Me-memes.vue - 我点赞的烂梗
- userInfo.vue / resetPwd.vue - 个人资料 / 重置密码

**AI 造梗** (`src/views/MainLayout/components/AiGenerateMemes/`)
- AIChat.vue - 流式对话（SSE + marked + DOMPurify）

**烂度 / 热度墙** (`src/views/MainLayout/components/stale-hot/`)
- stale.vue - 烂度榜 + 投票
- hotwall.vue - 实时热度墙（SSE）

**烂梗擂台 / 成长** (`src/views/MainLayout/components/play/`)
- arena.vue - 烂梗对决擂台（每日 PK + 周排行）
- growth.vue - 经验 / 勋章 / 排行榜

**签到 / 生命周期** (`src/views/MainLayout/components/keep/`)
- checkin.vue - 每日签到 + 钱包 + 打赏
- lifecycle.vue - 生命周期看板 + DNA v6 关联图谱（echarts）

**右侧悬浮栏** (`src/views/MainLayout/components/right-sidebar/`)
- FloatingSidebar.vue - 桌面端悬浮侧栏
- HomeWordCloudPanel.vue - 移动端首页词云

**Header 子组件** (`src/views/MainLayout/components/header-bar/components/`)
- desktop-header.vue / mobile-header.vue - 响应式 header
- login.vue / register.vue / resetPassword.vue - 登录/注册/找回密码
- userHome.vue - 用户菜单
- meme-dialog.vue - 热梗/搜索结果弹窗
- header-search.vue / header-message-entry.vue / header-business-entry.vue 等

### Pinia Stores

| Store | 文件 | 用途 |
|---|---|---|
| `useAuthStore` | stores/useAuthStore.ts | 登录态 + userId + 弹登录框 |
| `useMemeTagsStore` | stores/memeTags.ts | 全局烂梗标签字典（带 Promise 缓存） |
| `useThemeStore` | stores/themeStore.ts | 主题切换（light/dark/auto，持久化到 localStorage） |
| `useSubmissionDialogStore` | stores/useSubmissionDialogStore.ts | 投稿弹窗显隐 |
| `useGuiBinStore` | stores/GuiBinStore.ts | 斗鱼 63136 直播间贵宾数 |

### Composables

- `useIsMobile.ts` - 响应式判断 ≤600px 移动端，断点切换

### Utils

- `cookieUtils.ts` - token 管理（js-cookie）+ 简易 cookie 读写（向后兼容）
- `clipboard.ts` - 剪贴板复制 + 节流保护
- `common.ts` - sleep + useIsMobile
- `throttle.ts` - 节流 + 防抖
- `tags.ts` - 标签字符串解析为标签显示信息
- `time.ts` - formatDateTime / formatDate / formatShortTime / timeAgo / easyFormatTime
- `douyuWebSocket.ts` - 斗鱼弹幕 WS + 直播间贵宾数统计（**房间号已改为 63136**）

### Constants

- `backend.ts` - API 常量（`/dgq/...`）、MemeCategory 侧栏菜单（新增 6 个：贴吧/AI造梗/烂度/擂台/生命周期/热度墙）、全局 `Meme` 类型

### APIs

- `httpInstance.ts` - axios 实例（refresh token + 401 重登 + siteToken/dpahjdoiaw 来源统计）
- `getMeme.ts` - 热榜/搜索/分页/随机（新增 `getRandomMeme`）
- `setMeme.ts` - copyCountPlus1 / likeCountPlus1 / postCopy / submitMeme 等
- `announcement.ts` - 公告接口
- `memeDnaV6.ts` - DNA v6 关联图 / 演化路径
- `mergePig.ts` - 合成猪排行榜 / 个人排名

### Types

- `meme.ts` - Meme / HotMemeResponse / MemeListResponse / SearchMemeRequest / SortType / MemeTag 等
- `timeAlbum.ts` - AlbumImage / AlbumComment
- `memeDnaV6.ts` - DnaV6Relation / DnaV6Response

### 样式 / 主题

- `assets/css/dark.css` - 暗色模式全套变量与覆盖
- `assets/css/global.css` / `index.scss` - Element Plus 主题 + 全局重置
- 新增 12 个图标（post-bar / chat / stale / arena / lifecycle / hotwall / msg / statement / postComment / postIsLike / postNotLike / tag / ai_chat_user / validCode / chain）
- 新增 5 个用户头像占位图（user-img-0~4.png）

## 后端 SQL 调整文件

| 文件 | 用途 |
|---|---|
| `backend/sql/dgq_features.sql` | 本次新增的全部 dgq_* 表（公告 / 贴吧 / 签到 / 擂台 / 烂度 / 生命周期 / DNA / AI / 合成猪 / 词云 等约 22 张表） |
| `backend/sql/dgq_index_optimize.sql` | 既有 dgq_* 表的索引补充与优化 |
| `backend/sql/dgq_features_migration.sql` | （可选）从 machine_* 旧表向 dgq_* 新表迁移历史数据 |
| `backend/sql/dgq_features_README.md` | 迁移文件清单与执行顺序说明 |

## 后端代码迁移

启动 4 个并行 sub-agent 后台执行；**全部完成，`mvn compile` 在 `sb6657-dgq` 通过（126 个 Java 文件）**：

### 迁移文件清单

| 类别 | 文件数 | 来源 machine | 目标 dgq |
|---|---|---|---|
| Entity | 18 | `entity/*.java`（屏蔽赛事/屏蔽词） | `entity/Dgq*` 或 `entity/*` |
| Mapper (Java) | 19 | `mapper/*Mapper.java` | `mapper/Dgq*` 或 `mapper/*Mapper.java` |
| Mapper XML | 21 | `resources/mapper/*.xml` | `resources/mapper/*.xml` |
| Service | 15 | `service/*.java` | `service/Dgq*Service.java` |
| Service Impl | 15 | `service/Impl/*.java` | `service/Impl/Dgq*ServiceImpl.java` |
| Controller | 12 | `controller/*.java` | `controller/Dgq*Controller.java` |
| Helper | 2 | `service/Impl/{SendMsgUtils,AutoReviewBiz}.java` | `service/Impl/Dgq*` |
| Util | 2 | `util/{EmailDesensitizationUtil,PageUtils}.java` | `util/*` |
| VO/DTO | 3 | `VO/MySubmitLog.java`、`DTO/{SysMessageDTO,SysMsgListDTO}.java` | `VO/`、`DTO/` |
| 依赖 | 1 | `pom.xml`（HanLP） | `pom.xml` |

### 类名重命名规则

| 原 machine | dgq 新名 |
|---|---|
| `MachineAddService` / `Impl` | 合并入现有 `DgqAddService` / `Impl` |
| `MachineWebService` / `Impl` | 合并入现有 `DgqWebService` / `Impl` |
| `MachineImagesService` / `Impl` | 合并入现有 `DgqImagesService` / `Impl` |
| `MachineAddController` | 合并入现有 `DgqAddController` |
| `MachineWebController` | 合并入现有 `DgqWebController` |
| `MachineImagesController` | 合并入现有 `DgqImagesController` |
| `AnnouncementService` / `Impl` / `Controller` | `DgqAnnouncement*` |
| `ArenaService` / `Impl` / `Controller` | `DgqArena*` |
| `CheckinService` / `Impl` / `Controller` | `DgqCheckin*` |
| `HotWallService` / `Impl` / `Controller` | `DgqHotWall*` |
| `LifecycleService` / `Impl` / `Controller` | `DgqLifecycle*` |
| `MemeRelationService` / `Impl` / `Controller` | `DgqMemeRelation*` |
| `PostCommentService` / `Impl` / `Controller` | `DgqPostComment*` |
| `PostService` / `Impl` / `Controller` | `DgqPost*` |
| `PostReviewService` / `Impl` / `Controller` | `DgqPostReview*` |
| `StaleService` / `Impl` / `Controller` | `DgqStale*` |
| `SysMessageService` / `Impl` / `Controller` | `DgqSysMessage*` |
| `UserGrowthService` / `Impl` / `Controller` | `DgqUserGrowth*` |

### 表名重命名

所有引用 `machine_*` 表的 SQL 改为 `dgq_*`：

- `machine_allbarrage` → `dgq_allbarrage`
- `machine_memes_tags` → `dgq_memes_tags`
- `machine_unaudit` → `dgq_unaudit`
- `machine_submit` → `dgq_submit`
- `machine_chat` → `dgq_chat`
- `machine_images` → `dgq_images`
- `machine_comments` → `dgq_comments`
- `machine_hotlog` → `dgq_hotlog`
- `machine_announcement` → `dgq_announcement`
- `machine_post_bar` → `dgq_post_bar`
- `machine_post_comment` → `dgq_post_comment`
- `machine_post_info_like` → `dgq_post_info_like`
- `machine_post_review` → `dgq_post_review`
- `machine_post_statement` → `dgq_post_statement`
- `machine_sysmessage` → `dgq_sysmessage`

### URL 前缀重写

所有 `/machine/...` 端点 → `/dgq/...`（在 Controller 注解和 Const 中同步修改）。

### 删除项（按用户要求）

- 所有屏蔽词相关端点：`addShieldWord`、`addIsShieldWord`、`addNotShieldWord`、`getShieldWordDict`、`getMyShieldWordList`、`getShieldWordList`、`test` (敏感词调试)
- 超级逮虾户战报：`PostController.battleReportList`
- 赛事相关 Controller：`MatchPredictionController`、`MatchPredictionService(+Impl)`、`MatchPrediction*Mapper`、`MachineCompetiRecord`、`MachineMatches*`
- 年度TOP20：`machineHotListController`、`MachineHotListService(+Impl)`、`MachineHotListMapper`
- `ShieldWordFilter` Service、`MachineShieldWord` / `MachineShieldWordReview` 实体

### 设计决策与已知差异

1. **`MemeDnaV6Service` 跨模块依赖**：`cn.sb6657.machine.dna.v6.*` 在 machine 模块，dgq 不依赖。`DgqAddController.submitPassed` 里 1 分钟延迟的 DNA v6 计算被注释掉，留 TODO。后端需要决定：迁 DNA v6 引擎到 dgq，或放弃此功能。

2. **`DgqMemeRelationController` 响应格式变化**：原 machine 的 `MemeRelationController` 返回 `GraphResult`（中心点 + 节点 + 边列表），但 `GraphQueryEngine`/`MemeDnaService` 在 `cn.sb6657.machine.dna`。dgq 的 `DgqMemeRelationService` 只有简化版 `List<MemeRelation>`。前端 `lifecycle.vue` 调用 `/dgq/dna/v6/{id}` 取关联图时仍能跑（通过 `MemeRelationMapper`），但若期望完整 graph JSON 需后续增强。

3. **`@PostBarLog` 注解未迁移**：machine 的 `cn.sb6657.machine.anno.PostBarLog` 不在 dgq。`DgqPostCommentController` 和 `DgqPostReviewController` 移除该注解，留 TODO。如需 AOP 行为，需把注解迁到 `cn.sb6657.dgq.anno.PostBarLog`。

4. **图片/评论端点路径共存**：原 dgq `/dgq/showImage`（list）和 `/dgq/addCommentname` 保留；machine 版本的 `/dgq/showImagePage`（分页）和 `/dgq/addComment`（需登录）作为新路径并存。

5. **`PostCommentServiceImpl` 的 `SensitiveWordFilter`**：原 `@Autowired SensitiveWordFilter` 注入和 `filter()` 调用已移除，改为 TODO 占位。可后续接入 `cn.sb6657.common.utils.SensitiveWordFilterUtils`。

### 编译结果

`mvn compile -pl sb6657-dgq` 在所有 126 个 Java 文件上 **BUILD SUCCESS**。仅 pre-existing 的 deprecation/unchecked 警告，无新错误。

## 冬瓜强房间号

**63136**（取代 frontend 的 6657）。在以下位置更新：
- `src/utils/douyuWebSocket.ts` - WS 连接 + 开播通知文案
- `src/views/MainLayout/components/footer-bar.vue` - 友情链接
- `src/components/home/homeIntro.vue` - 站点介绍
- `src/constants/backend.ts` - 新增 `DOUYU_ROOM_ID` 常量

## 品牌一致性

- `dpahjdoiaw` 来源统计头保持 `'eAR48ZFJwfRTy6SyQPFj'`（与 sb6657 站点共享同一后端基础设施）
- 安装插件 URL：保持 `https://cdn.hguofichp.cn/dgq63136.user.js`（油猴脚本独立，不改）
- 邮箱地址：移除 sb6657.cn 的 `he20020928@foxmail.com`，提示"见 dgq63136.cn 站点说明"

## 排除项（按用户要求）

| 路由 / 功能 | 文件 | 原因 |
|---|---|---|
| `/matchPrediction` / `/matchLib` | `match-prediction/*.vue` | 赛事库 + 赛事烂梗库 + 赛事竞猜均排除 |
| `/shieldWord` | `shieldWord.vue` | 屏蔽词排除 |
| `/15warriorsDonk` | `15warriorsDonk.vue` | 布雷德15勇士排除 |
| `/dejaVuNiko` | `deja-vu-niko.vue` | 超级逮虾户战报排除 |
| `/memeTop20` | `memeTop20.vue` | 年度TOP20排除 |
| `components/AnnualHotList.vue` | 524 行 DGQ 版 | 年度TOP20，DGQ 原版保留不动（被 Starrysky 引用，走 /dgq/hotTop20/*） |
| `shieldWordStore` | `stores/shieldWordStore.ts` | 屏蔽词 store，从依赖中剥离 |
| 关联 `getShieldWordDict.ts` / `match.ts` API 文件 | 删除 | 不需要 |

## 验证状态

### 前端构建

```bash
cd DGQ63136.cn
npm run verify
```

输出：
```
install page verification passed
✓ 2385 modules transformed.
✓ built in ~1m
```

`dist/` 目录成功生成，包含完整静态资源。

### 后端构建

```bash
cd backend
mvn compile -pl sb6657-dgq
```

输出：**BUILD SUCCESS**（126 个 Java 文件，仅 pre-existing 警告）。

配合 SQL DDL 脚本（`dgq_features.sql` + `dgq_index_optimize.sql`）执行即可。

## 后续建议

1. **DNA v6 跨模块依赖**：把 `cn.sb6657.machine.dna.v6.*` 迁入 dgq 模块，或简化为仅用 SQL JOIN 查关联表
2. **`@PostBarLog` 注解**：在 `cn.sb6657.dgq.anno` 下重建，并补 AOP 切面实现
3. **`MemeRelationController` 响应格式**：要么迁 `GraphQueryEngine`，要么让 `lifecycle.vue` 适配简化版响应
4. **TypeScript 严格化**：迁移后的部分组件仍是 frontend 风格的宽松类型（如 `any[]`），后续可逐文件补强
5. **响应式优化**：memes-view.vue、post-bar-main.vue 在移动端的样式仍需调整（当前只用了 `isMobile` 做基础切换）
6. **页面单测**：建议为关键路由（lifecycle / arena / hotwall）补充 e2e 测试
