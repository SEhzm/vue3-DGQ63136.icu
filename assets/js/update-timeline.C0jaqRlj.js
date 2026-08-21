import{T as E,U as I}from"./element-plus.CjXZWZgX.js";import{d as L,b as C,o as c,c as m,a as l,L as B,P as T,H as v,O as _,a4 as y,G as w,M as V,C as O,u as D}from"./@vue.nHVPVMhJ.js";import{_ as $}from"./index.ZIscfV68.js";import"./lodash-es.C-zDejYo.js";import"./@vueuse.BpfxSBwI.js";import"./@element-plus.COZsae15.js";import"./@popperjs.D9SI2xQl.js";import"./@ctrl.r5W6hzzQ.js";import"./dayjs.DW_GSUNX.js";import"./aplayer.Y0QqkN1l.js";import"./async-validator.DKvM95Vc.js";import"./memoize-one.BdPwpGay.js";import"./normalize-wheel-es.B6fDCfyv.js";import"./@floating-ui.8uccrNCM.js";import"./pinia.ZuSt0W2H.js";import"./js-cookie.5NsoCi1B.js";import"./axios.CCb-kr4I.js";import"./vue-router.CMIwPDU-.js";import"./matter-js.D2aELUe1.js";const U=`## 版本【26.08.18】\r
\r
1、【优化】投稿重复提示文案，减少误解。\r
\r
## 版本【26.08.13】\r
\r
1、【重构】machine → dgq 全量迁移完成：dgq 模块 22 个 mapper XML 统一加 \`Dgq\` 前缀，避免与 machine 模块同名 XML 在同一 classpath 下冲突\r
2、【重构】dgq 模块 XML 内 26 张 A 类表名批量替换 \`machine_* → dgq_*\`（machine_post_bar → dgq_post_bar 等）；machine_submit / machine_match_meme / machine_shield_word / machine_meme_dna_v6 等 B 类专有表保持原名（dgq 站点不使用这些功能）\r
3、【修改】后端字段补齐（\`dgq_patch.sql\`）：\`dgq_allbarrage.is_del\`、\`dgq_memes_tags.is_del\`、\`dgq_submit.user_id / match_id / is_del / create_time / review_time\`、\`dgq_post_bar.title / battle_report\`、\`dgq_post_info_like.type / to_user_id / statement_num\`\r
4、【新增】\`dgq_meme_dna_v6\` / \`dgq_meme_relation_v6\` 新表，配合 dgq 模块 DNA v6 功能\r
5、【修复】\`DgqWebMapper.xml\` 补齐 5 个缺失的 SQL：\`pageSearch\`、\`douyuEx\`、\`getBarrageById\`、\`matchPageList\`（赛事功能空实现）、\`memesOfMeList\`（改读 \`dgq_submit\`）\r
6、【修复】\`random-meme.vue\` 解构错误：原本 \`{ _failure, flatData } = await getRandomMeme()\`，但 \`getRandomMeme\` 实际返回 meme 对象或 \`false\`，导致页面始终停在"暂无烂梗数据"\r
7、【修复】\`search-dialog.vue\` 改用 \`/dgq/pageSearch\` 高级搜索接口；\`sort\` 字段改为 \`0\`（按时间）或 \`1\`（按复制次数）整数\r
8、【重构】新增 \`PackageAwareBeanNameGenerator\`，MyBatis MapperScan 使用 FQCN 命名，避免 19 个同名 mapper 接口 bean 冲突\r
9、【重构】dgq 模块 8 个 DNA bean（\`DnaScorer\`、\`MemeDnaExtractor\`、\`GraphQueryEngine\`、\`MemeDnaService\` 等）显式命名 \`dgqDnaXxx\`，注入点同步 \`@Qualifier\`\r
10、【修改】斗鱼房间号 6657 → 63136：\`douyuWebSocket.ts\`、\`homeIntro.vue\`、\`footer-bar.vue\`、\`backend.ts\` 的 \`DOUYU_ROOM_ID\` 常量\r
11、【修改】前端打包 \`npm run verify\` 验证通过；后端 \`mvn compile -pl sb6657-admin -am\` BUILD SUCCESS\r
12、【移除】赛事 / 屏蔽词 / 年度 TOP20 / 布雷德 15 勇士 / 超级逮虾户战报：按用户要求 dgq 站点不需要这些功能，对应路由、组件、Service、Mapper 全部不迁移\r
\r
## 版本【26.08.11】\r
\r
1、【新增】左侧菜单增加"一键安装插件"入口，移动端横向入口同步展示\r
2、【新增】一键安装插件页面展示当前弹幕插件版本号、一键安装按钮、油猴管理器入口和 Greasy Fork 备用入口\r
3、【新增】一键安装插件页面下方展示更新历史，包含日期、版本号和更新内容\r
4、【修改】一键安装插件按钮跳转到 Greasy Fork 官方 update 安装地址\r
\r
## 版本【26.08.11-hotfix-V0.1.4】\r
\r
1、【修复】更新安装页面到 V0.1.4（dgq 项目独立后 commit 记录，原更新日志 markdown 遗漏）\r
\r
## 版本【26.08.11-hotfix-V0.1.5】\r
\r
1、【修改】更新安装页面到 V0.1.5\r
\r
## 版本【26.08.11-hotfix-V0.1.6】\r
\r
1、【修改】更新安装页面到 V0.1.6\r
\r
## 版本【26.08.11-hotfix-V0.1.7】\r
\r
1、【修改】更新安装页面到 V0.1.7\r
\r
## 版本【26.08.11-hotfix-V0.1.8】\r
\r
1、【修改】更新安装页面到 V0.1.8\r
\r
## 版本【26.08.11-hotfix-V0.1.9】\r
\r
1、【修改】更新安装页面到 V0.1.9\r
\r
## 版本【26.08.11-hotfix-V0.2.0】\r
\r
1、【修改】更新安装页面到 V0.2.0\r
\r
## 版本【26.08.11-doc】\r
\r
1、【调整】展开 Tampermonkey 权限说明文档\r
2、【调整】细化浏览器扩展权限获取流程说明\r
\r
## 版本【26.08.11-cdn】\r
\r
1、【重构】CDN 全面转向仓库自托管，移除外部 CDN 依赖\r
\r
> **说明**：\`26.08.11-hotfix-V0.1.4\` ~ \`26.08.11-cdn\` 这 9 条原仅在 dgq 仓库的 commit message 中，更新日志 markdown 没补。从 frontend 的 \`V3.14.14.20260807\` 分叉后，dgq 仓库独立 commit 的内容整理至此。\r
\r
---\r
\r
## 版本【V3.14.14.20260807】（frontend 共建历史）\r
\r
1、【修复】修复合成大猪头落球后未推进预告队列、始终重复同一球的问题\r
2、【修复】统一在线与离线补球确认流程，避免等待响应期间重复落球\r
\r
## 版本【V3.14.13.20260807】\r
\r
1、【优化】优化网络问题导致猪头未下发成功的离线兜底\r
2、【优化】重新开始游戏后流被误关闭的问题\r
\r
## 版本【V3.14.12.20260807】\r
\r
1、【优化】时光相册改为自适应照片网格，移动端窄屏固定双列展示\r
2、【优化】重整照片标题、评论操作、加载状态和评论弹窗样式，清理历史行内样式与自动提示\r
3、【重构】按职责拆分时光相册的照片网格、照片卡片和评论弹窗，相关 Vue 单文件均控制在 300 行以内\r
4、【重构】将 \`useIsMobile()\` 从通用工具迁移至 \`src/composables/\`，统一更新全部调用入口\r
5、【修改】新增 Vue 组件 300 行上限及页面子组件、工具函数、composable 的目录规范\r
\r
## 版本【V3.14.11.20260806】\r
\r
1、【新增】合成大猪头小游戏\r
\r
## 版本【V3.14.10.20260803】\r
\r
1、【优化】优化DNA算法v6\r
\r
## 版本【V3.14.9.20260731】\r
\r
1、【新增】全站主题切换，支持浅色模式、深色模式和跟随系统，并记住用户选择\r
2、【优化】桌面端、移动端主要页面与星空背景适配深色模式\r
3、【新增】首页简介补充签到、梗币、勋章、经验体系及梗生命周期与 DNA 入口\r
\r
## 版本【V3.14.8.20260731】\r
\r
1、【修复】移除移动端内容区全局浅灰底色，避免遮挡星空背景\r
\r
## 版本【V3.14.7.20260731】\r
\r
1、【新增】底部友情链接增加"弗一把"网站入口\r
2、【新增】首页增加内置官网英文标语的"弗一把"紧凑斜切合作推广卡片\r
\r
## 版本【V3.14.6.20260730】\r
\r
1、【新增】注册页前端/后端双重校验：昵称禁止使用邮箱格式（正则校验），防止用户把邮箱当昵称\r
2、【新增】个人中心/后台个人资料修改接口增加改名次数限制：昵称仅可修改 1 次，用完后前端输入框禁用、后端拦截报错\r
3、【优化】DNA 关联图谱弹窗高度调整为视口 90%（\`top="5vh" + CSS calc(90vh - 200px)\`），ECharts 图表区域自适应撑满\r
4、【优化】DNA 节点文本改用微软雅黑字体；中心节点字号 13px、普通节点 11px（各加大一号）；矩形宽度按文本自动包裹、高度按行数自适应，2px 圆角\r
5、【优化】Tooltip 字体微软雅黑、字号 11px，内容精简为 ID+文本+时间+关键词，避免遮挡\r
6、【优化】DNA图谱V5算法，增加事件及衍生梗的关联\r
\r
## 版本【V3.14.5.20260726】\r
\r
1、【优化】DNA 关联图谱算法 v3：文本相似度改用字符 bigram Jaccard（修复旧版 charBitset 丢弃所有中文的 bug），候选集按标签重叠数排序截断 top-150，实际复杂度 O(n·K·logK)；权重调整为 tag×0.6+text×0.4，阈值降至 0.10，关联结果更相似\r
\r
## 版本【V3.14.4.20260725】\r
\r
1、【优化】内容区增加浅灰底色（#f2f3f5），文字不再浮在纯白背景上\r
2、【优化】所有新功能页面（段位/烂度/擂台/签到/生命周期/热度墙）加白色卡片容器+圆角+阴影，提升可读性\r
3、【重构】实时热度墙去掉"是否开播"判断，改为心跳轮询+事件推送混合模式，始终显示真实热门梗\r
4、【优化】四个新功能页面去掉点赞，统一按复制数展示\r
5、【新增】烂梗 hover 显示标签名（字典转换）+ 投稿时间 tooltip\r
6、【优化】DNA 关联入口更醒目，即时计算改为针对性查询不再全量加载\r
7、【新增】勋章扩充到 17 个，排行榜默认显示前 100\r
8、【新增】每满 100 次复制给投稿者 1 梗币\r
9、【新增】索引优化 SQL（index_optimization.sql）\r
\r
## 版本【V3.14.3.20260724】\r
\r
1、【修复】烂度榜逻辑重做：贝叶斯均分公式（5票先验×50分），单票无法操纵排名；无投票梗 fallback 上限 70° 不再全是 100°\r
2、【修复】烂度热榜改为显示 hotScore（复制×时间衰减），与烂度榜区分\r
3、【优化】烂度榜改为触底无限滚动加载（IntersectionObserver），不再只有 20 条\r
4、【优化】所有限流统一改为滑动窗口式，替换旧的"上次请求时间"式限流\r
5、【新增】SlidingWindowRateLimiter 共享限流器（sb6657-common），基于 ConcurrentLinkedDeque 实现\r
\r
## 版本【V3.14.2.20260723】\r
\r
1、【移除】玩梗接龙功能（前后端完整移除）\r
2、【修改】梗王段位和签到钱包（改名"我的梗币"）从侧边栏移入右上角头像下拉菜单\r
3、【优化】梗生命周期看板改为触底加载（IntersectionObserver 无限滚动），不再一次性拉取全量数据\r
4、【优化】梗生命周期 PC 端布局改为自适应多列网格（auto-fit），宽屏下四栏并排\r
5、【新增】后端生命周期分阶段分页接口 /machine/lifecycle/stage/{stage}?pageNum=&pageSize=\r
\r
## 版本【V3.14.1.20260722】\r
\r
1、【优化】梗王段位页面全面重做：火焰进度条、脉冲光环等级徽章、翻牌勋章墙、皇冠排行榜前三名、渐变入场动画\r
2、【优化】烂度指数榜全面重做：温度计式烂度指标、火焰/冰霜投票按钮、金银铜排名徽章、脉冲分数动画\r
3、【优化】烂梗对决擂台全面重做：旋转光环 VS 徽章、火焰战力条、击中粒子效果、获胜皇冠、倒计时脉冲\r
4、【优化】AI 玩梗接龙全面重做：彩虹渐变题目卡、AI 分数等级环、作品列表入场动画、创意提交按钮\r
5、【优化】签到梗币钱包全面重做：全息卡片钱包、火焰连续签到条、签到时金币雨粒子特效、搜索打赏一体化\r
6、【优化】梗生命周期看板全面重做：渐变四阶段时间线、DNA 双螺旋加载动画、彩色相似度条、hover 展开效果\r
7、【优化】实时弹幕热度墙全面重做：赛博朋克暗色流、霓虹脉冲连接点、事件类型彩色徽章、渐变热度排行条\r
8、【修复】对决擂台页面匹配后端真实数据结构（ArenaMatch 字段名、投票接口参数）\r
9、【修复】签到状态端点返回类型不匹配（boolean → UserCheckin 对象）\r
10、【修复】成长体系后端补充 nextLevelExp 和完整勋章墙数据（all + owned）\r
11、【修复】实时热度墙 SSE 卸载竞态（alive 标志位防止已卸载组件 DOM 更新崩溃）\r
\r
## 版本【V3.14.0.20260721】\r
\r
1、【新增】梗王段位 + 勋章墙：投稿过审/被点赞/上热榜得经验，7 级段位 + 6 种勋章 + 经验排行榜\r
2、【新增】烂度指数榜：每个烂梗 0–100 烂度分，用户投票 + 时间衰减热榜\r
3、【新增】烂梗对决擂台：每日 2 梗单败淘汰，全站投票 pick 年度最烂梗\r
4、【新增】AI 玩梗接龙：给出题目用户接梗，AI 评分 + 用户点赞排名\r
5、【新增】签到 + 梗币钱包 + 打赏：每日签到领梗币，连续签到奖励更多，可打赏喜欢的烂梗\r
6、【新增】梗生命周期看板：新生儿/爆发期/烂大街/已入土四阶段 + 梗 DNA 关联图谱\r
7、【新增】实时弹幕热度墙（SSE）：最近 5 分钟热门梗实时滚动排行\r
\r
## 版本【V3.13.13.20260721】\r
\r
1、【新增】全部烂梗页支持通过 URL 标签参数自动筛选，首页随机烂梗标签可点击跳转\r
\r
## 版本【V3.13.12.20260721】\r
\r
1、【新增】首页搜索词云支持点击词条直接搜索\r
2、【优化】缩小首页随机烂梗复制热区，仅文案和复制按钮可触发复制\r
\r
## 版本【V3.13.11.20260721】\r
\r
1、【修改】启用 \`Vmajor.minor.patch.yyyymmdd\` 版本号规则，补充第三版网站历史版本溯源与后续升级口径\r
2、【优化】统一新版本展示，更新日志兼容新旧标题、按日期合并时间线节点并分开展示发布日期与语义版本\r
\r
## 版本【26.07.15】\r
\r
1、【新增】首页和底部栏增加 sb6657 时光机复古版入口\r
\r
## 版本【26.07.14】\r
\r
1、【优化】更新烂梗列表排序切换与投稿区域样式\r
2、【优化】首页内嵌投稿模块新增标题，提升投稿入口辨识度\r
3、【重构】移除首页友情链接模块并整合至底部栏，补充常用入口并更新底部栏样式\r
\r
## 版本【26.07.12】\r
\r
1、【重构】拆分桌面端与移动端顶部栏，并按职责解耦搜索、热梗、投稿、消息和提示弹窗逻辑\r
2、【重构】将桌面顶部栏吸顶定位上移至主布局，明确组件与布局职责\r
3、【重构】由主布局统一判断并挂载桌面侧边栏和移动端顶部选择栏\r
4、【修复】修复桌面侧边栏吸顶偏移不一致导致滚动后延迟固定的问题\r
5、【重构】新增全局弹窗宿主和独立 Pinia 状态，将烂梗投稿弹窗改为全局单例\r
6、【新增】搜索无结果时可直接点击"投稿"打开烂梗投稿弹窗\r
\r
## 版本【26.07.11】\r
\r
1、【优化】移动端顶部选择栏会自动滚动显示当前选中项\r
2、【重构】拆分移动端顶部选择栏和桌面端侧边栏组件\r
3、【修复】修复移动端热门烂梗轮播遮挡吸顶选择栏及弹窗遮罩层级异常，优化热梗弹窗双端宽度\r
\r
## 版本【26.07.10】\r
\r
1、【重构】优化移动端顶部选择栏，全新样式+吸顶\r
2、【修复】修复热门烂梗在移动端消失bug\r
3、【修复】修复移动端顶部选择栏遮罩和浮动侧边栏撑开页面宽度的问题\r
4、【修复】保存时自动格式化工具冲突问题，顺带格式化一批代码\r
\r
## 版本【26.07.04】\r
\r
1、【优化】热梗弹窗 hover 信息补充烂梗 ID、热榜时间并调整展示排版\r
2、【修改】暂时隐藏首页超级逮虾户战报推荐入口，保留侧边栏和路由入口\r
\r
## 版本【26.07.01】\r
\r
1、【优化】整理项目文档目录，将更新日志和油猴脚本说明移动到 docs 目录\r
2、【新增】引入 AGENTS.md 与 repo skills，沉淀 AI 开发、验证和提交流程\r
3、【优化】迁移 ESLint 9 flat config，恢复 npm run lint 基础检查\r
4、【修复】修复注册页验证码刷新逻辑中的 ref 读取方式\r
5、【优化】清理部分 ESLint 手工 warning，精简烂梗列表 AllBarrage 分类逻辑\r
\r
## 版本【26.06.25】\r
\r
1、【新增】顶部栏添加一个大红投稿按钮\r
\r
## 版本【26.06.11】\r
\r
1、【优化】hash路由改history路由\r
\r
## 版本【26.06.09】\r
\r
1、【新增】月薪喵屏保\r
\r
## 版本【26.05.31】\r
\r
1、【新增】AI造梗重构，加入记忆，会话记录\r
\r
## 版本【26.05.26】\r
\r
1、【新增】首页推广友链\r
2、【新增】vite版本升级，actions的node版本升级\r
\r
## 版本【26.05.21】\r
\r
1、【重构】重构首页侧边栏，抽取成组件不再塞在背景组件。顺便为广告增加一个关闭按钮\r
\r
## 版本【26.05.18】\r
\r
1、【新增】布雷德15勇士图片下载功能\r
\r
## 版本【26.04.25】\r
\r
1、【优化】优化github action流程\r
2、【修改】旧群炸了，q群信息修改\r
\r
## 版本【26.02.20】\r
\r
1、【新增】布雷德15勇士25年最终榜存档页\r
2、【重启】布雷德15勇士恢复更新\r
\r
## 版本【26.01.11】\r
\r
1、【新增】年度TOP20烂梗评选 留档\r
2、【优化】下掉过时的提示弹窗\r
\r
## 版本【25.12.01】\r
\r
1、【重启】2025年度TOP20烂梗评选\r
\r
## 版本【25.11.21】\r
\r
1、【修复】Major竞猜日期显示\r
2、【新增】布达佩斯Major硬币\r
\r
## 版本【25.11.15】\r
\r
1、【新增】布雷德15勇士榜单 增加每次比赛数据变动详情\r
\r
## 版本【25.11.02】\r
\r
1、【新增】屏蔽词投稿功能，烂梗自动匹配是否是屏蔽词\r
2、【新增】屏蔽词投稿\r
3、【新增】我的投稿屏蔽词查询\r
\r
## 版本【25.11.01】\r
\r
1、【前端基建】配置eslint、prettier与vscode插件，配置settings.json\r
\r
## 版本【25.10.26】\r
\r
1、【重构】拆分标签选择组件，把所有涉及到标签选择的地方统一使用这个组件\r
\r
## 版本【25.10.25】\r
\r
1、【新增】超级逮虾户战报和布雷德15勇士不再前端写死，使用oss上的动态数据，可以热更新不需要重新部署前端项目\r
2、【优化】部分图片改用oss储存，更加可靠加载速度更快\r
\r
## 版本【25.10.12】\r
\r
1、【新增】首页增加烂梗总数和最新投稿展示\r
2、【重构】抽取getDisplayTags函数，统一用于显示标签\r
\r
## 版本【25.10.09】\r
\r
1、【优化】优化我的投稿展示\r
\r
## 版本【25.10.07】\r
\r
1、【优化】首页样式优化，重构代码，拆分组件解耦\r
2、【优化】布雷德十五勇士榜3.0 样式优化，添加B1ad3头像与规则\r
3、【优化】更新日志样式优化，更改配色\r
\r
## 版本【25.10.06】\r
\r
1、【更新】相册分页\r
\r
## 版本【25.10.04】\r
\r
1、【新增】前端更新日志页面\r
2、【新增】首页内容优化\r
3、【重构】首页随机烂梗组件拆分\r
4、【新增】封装项目通用get方法\r
\r
## 版本【25.09.21】\r
\r
1、【重构】去掉自动导入的依赖（因为影响了IDE的跳转功能，sad，vue插件做的太烂了）\r
2、【重构】修复部分ts类型错误，项目的入口各种基建改为ts\r
3、【修复】修复控制台各种waring\r
4、【修复】isRelogin变量正确使用ref，控制登录状态的ui显示\r
\r
## 版本【25.09.20】\r
\r
1、【新增】布雷德十五勇士榜单\r
2、【优化】搜索重构，添加分页\r
3、【优化】我的投稿添加复制数行，去掉多余提示\r
4、【优化】封装请求库post请求函数，方便添加ts类型使用\r
\r
## 版本【25.09.19】\r
\r
1、【新增】超级逮虾户战报\r
\r
## 版本【25.09.15】\r
\r
1、【新增】搜索结果按时间/复制次数排序\r
\r
## 版本【25.09.14】\r
\r
1、【新增】顶部搜索弹窗增加高级搜索\r
2、【优化】顶部搜索弹窗分页优化性能，搜索请求防抖，优化移动端输入框enter键使用体验\r
3、【优化】删去首页的高级搜索\r
\r
## 版本【25.09.01】\r
\r
1、【新增】搜索词关键字高亮\r
2、【优化】tag内容上下居中\r
\r
## 版本【25.08.31】\r
\r
1、【新增】删去侧边栏老旧分类，现已全面由tag系统代替\r
2、【新增】添加tags的pinia store，后续优化项目中重复加载tag问题\r
3、【优化】清理无用依赖，升级依赖版本\r
4、【修复】解决大量终端及控制台warning\r
5、【重构】单开一个类型文件夹，后续ts类型放这里\r
6、【重构】搜索弹窗组件解耦，单独成一个组件，后续计划在此添加高级搜索\r
7、【修复】修复列表过长时，浏览器合并动画帧造成复制数量+1的时候不显示的bug\r
\r
## 版本【25.7.07】\r
\r
1、【新增】我的投稿记录\r
\r
## 版本【25.7.06】\r
\r
1、【新增】首页加载页\r
2、【优化】词云异步加载，减少阻塞\r
\r
## 版本【25.6.16】\r
\r
1、【新增】AI造梗\r
2、【优化】赛事库关联烂梗\r
\r
## 版本【25.6.11】\r
\r
1、【修改】去除左侧重复菜单分类\r
2、【新增】添加赛事烂梗库\r
\r
## 版本【25.6.07】\r
\r
1、【新增】major硬币展示\r
\r
## 版本【25.6.02】\r
\r
1、【更新】major作业大更新\r
\r
## 版本【25.5.04】\r
\r
1、【新增】烂梗投稿时间显示\r
\r
## 版本【25.5.03】\r
\r
1、【新增】提供直播间开播提醒和贵宾显示\r
\r
## 版本【25.4.24】\r
\r
1、【修复】修复消息红点\r
\r
## 版本【25.4.22】\r
\r
1、【修复】修复注册问题，原因是变量命名错误\r
2、【优化】添加更多头像，替换为网络图片\r
\r
## 版本【25.4.21】\r
\r
1、【新增】鱼吧功能 ---需要登录使用\r
\r
 发帖、关联烂梗 、评论帖子、评论回复、帖子表态、帖子点赞、评论点赞\r
\r
 鱼吧相关消息(评论，点赞，表态...)推送\r
\r
2、【新增】引入Ai辅助人工审核帖子\r
\r
3、【更新】更新社区规范和隐私策略\r
\r
4、【警告】违法社区规范和国家法律将上报gov监管部门、本网站已完全记录个人的操作记录(非隐私操作)\r
\r
## 版本【25.3.24】\r
\r
1、【新增】内测：注册功能\r
\r
2、【新增】douyuEX插件支持sb6657.cn烂梗自动补全\r
\r
## 版本【25.3.19】\r
\r
1、【新增】首页高级检索\r
\r
## 版本【25.3.15】\r
\r
1、【修复】修复复制为undefined的bug\r
\r
2、【修复】修复热门次数显示的问题\r
\r
## 版本【25.3.07】\r
\r
1、【新增】搜索词云\r
\r
2、【调研】用户调研\r
\r
## 版本【25.02.18】\r
\r
1、【修改】修改样式，确保底部展示\r
\r
2、【修改】修复移动端标签触摸展示问题\r
\r
3、【新增】上线点赞功能\r
\r
4、【新增】顶部栏毛玻璃样式\r
\r
## 版本【25.02.17】\r
\r
1、【修改】底部的展示\r
\r
2、【破费】续费服务器\r
\r
## 版本【25.02.04】\r
\r
1、【新增】tag式烂梗排序\r
\r
## 版本【25.02.03】\r
\r
1、【新增】tag式烂梗\r
\r
2、【删改】top20下线\r
\r
## 版本【25.01.25】\r
\r
1、【新增】新年限定：烟花\r
\r
2、【        】top20准备下线\r
\r
## 版本【25.01.18】\r
\r
1、【新增】更新日志文件\r
\r
2、【修改】样式修正\r
\r
3、【新增】右下角版本号\r
\r
4、【新增】纯净星空背景\r
\r
5、【新增】前后端都支持ipv6标签展示\r
`,P={class:"update-timeline"},j={class:"content-text"},G=L({__name:"update-timeline",setup(W){function b(e){const a=e.match(/[.+](\d{4})(\d{2})(\d{2})$/);if(a){const[,r,s,i]=a;return`${r}-${s}-${i}`}const n=e.match(/^(\d{2})\.(\d{1,2})\.(\d{1,2})$/);if(n){const[,r,s,i]=n,g=`20${r}`,h=s.padStart(2,"0"),p=i.padStart(2,"0");return`${g}-${h}-${p}`}return e}function q(e){const a=e.match(/^(V\d+\.\d+\.\d+)[.+]\d{8}$/);return`版本【${a?a[1]:e}】`}function x(){const e=[];return U.split(/## 版本【/).filter(n=>n.trim()).forEach(n=>{const r=n.trim().split(`
`);if(r.length===0)return;const s=r[0].match(/^([^】]+)】/);if(!s)return;const i=s[1],g=q(i),h=b(i),p=[];let t=null;r.slice(1).forEach(u=>{const o=u.trim();if(!o||o.startsWith("#"))return;const f=o.match(/^\d+、【([^】]*)】(.*)$/);if(f){t&&p.push(t);let d=f[1].trim(),N=f[2].trim();d||(d="其他"),t={type:d,content:N}}else if(o.match(/^\d+、/)){t&&p.push(t);const d=o.replace(/^\d+、/,"").trim();d&&(t={type:"其他",content:d})}else t&&(u.startsWith("	")||u.startsWith("​")||u.match(/^\s{2,}/))?t.content+=`
`+o:o&&!o.startsWith("##")&&(t?t.content+=`
`+o:t={type:"其他",content:o})}),t&&t.content.trim()&&p.push(t),p.length>0&&e.push({version:g,date:h,updates:p})}),e.reverse()}function M(e){const a=new Map;return e.forEach(n=>{const r=a.get(n.date)??[];r.push(n),a.set(n.date,r)}),Array.from(a,([n,r])=>({date:n,versions:r}))}const A=C(M(x())),S={新增:"update-type-add",修复:"update-type-fix",优化:"update-type-optimize",删除:"update-type-delete",删改:"update-type-delete",重构:"update-type-refactor",修改:"update-type-change",调整:"update-type-adjust",更新:"update-type-update",调研:"update-type-research",破费:"update-type-cost",警告:"update-type-warning",前端基建:"update-type-infra",重启:"update-type-restart"};function k(e){return S[e]||"update-type-other"}return(e,a)=>(c(),m("div",P,[a[0]||(a[0]=l("h2",{class:"title"},[B(" 更新日志 "),l("span",{class:"tips"},"(与源码 docs/更新日志.md 同步)")],-1)),T(D(I),null,{default:v(()=>[(c(!0),m(_,null,y(A.value,n=>(c(),w(D(E),{key:n.date,timestamp:n.date,placement:"top",type:"success"},{default:v(()=>[(c(!0),m(_,null,y(n.versions,r=>(c(),m("section",{key:r.version},[l("h3",null,V(r.version),1),l("ul",null,[(c(!0),m(_,null,y(r.updates,(s,i)=>(c(),m("li",{key:i,class:O([k(s.type),"update-content"])},[l("strong",null,"【"+V(s.type)+"】",1),l("span",j,V(s.content),1)],2))),128))])]))),128))]),_:2},1032,["timestamp"]))),128))]),_:1})]))}}),dn=$(G,[["__scopeId","data-v-4911d431"]]);export{dn as default};
