// 优先从环境变量读取后端地址，未设置时回退默认值
export const SERVER_ADDRESS = (import.meta.env.VITE_BASE_URL as string) || 'https://hguofichp.cn:10086';

// 冬瓜强斗鱼房间号
export const DOUYU_ROOM_ID = 63136;

export const API = {
    // ===== 烂梗基础 CRUD =====
    INCREASE_COPY_COUNT: '/dgq/addCnt',                  // 增加复制次数
    INCREASE_LIKE_COUNT: '/dgq/like',                    // 增加点赞次数
    GET_HOT_MEME_24h: '/dgq/hotBarrageOf24H',            // 24小时热门烂梗
    GET_HOT_MEME_7D: '/dgq/hotBarrageOf7Day',            // 7天热门烂梗
    SEARCH_MEME: '/dgq/Query',                         // 关键词搜索烂梗（DGQ 原生接口，向后兼容）
    SEARCH_MEME_ADV: '/dgq/pageSearch',                // 高级搜索（带标签/排序/分页，后续补）
    GET_ALL_MEME: '/dgq/Page?',                          // 全部烂梗分页
    GET_SORTED_ALL_MEME: '/dgq/sortAllBarrage',          // 按复制次数排序
    GET_FK_DGQ_MEME: '/dgq/Page?tags=01',                // 喷冬瓜强篇
    GET_FK_EACHOTHER_MEME: '/dgq/Page?tags=00',          // 直播间互喷篇
    GET_FK_CHAOGE_MEME: '/dgq/Page?tags=07',             // 喷超哥篇
    GET_XTT_MEME: '/dgq/Page?tags=08',                   // 小团体篇
    GET_QUQU_MEME: '/dgq/Page?tags=06',                  // QUQU篇
    GET_JZCM2022_MEME: '/dgq/Page?tags=02',              // 警钟长鸣2022
    GET_JZCM2023_MEME: '/dgq/Page?tags=03',              // 警钟长鸣2023
    GET_JZCM2024_MEME: '/dgq/Page?tags=04',              // 警钟长鸣2024
    GET_JZCM2025_MEME: '/dgq/Page?tags=05',              // 警钟长鸣2025
    GET_RAND_ONE_MEME: '/dgq/getRandOne',                // 随机一条烂梗
    SUBMIT_MEME: '/dgq/submission',                      // 烂梗投稿
    GET_MEME_TAGS: '/dgq/dictList',                      // 标签字典

    // ===== 用户体系 =====
    LOGIN: '/login',                                     // 登录
    REGISTER: '/register',                               // 注册
    LOGOUT: '/logout',                                   // 登出
    REFRESH_TOKEN: '/refresh-token',                     // 刷新 token
    GET_USER_INFO: '/getInfo',                           // 获取用户信息
    RESET_PASSWORD: '/system/user/resetPwd',             // 重置密码
    SEND_EMAIL_CODE: '/system/user/sendEmailCode',       // 发送邮箱验证码
    GET_USER_LIKE_MEMES: '/dgq/MeMemesPageList',         // 我点赞的烂梗
    UPDATE_USER_INFO: '/system/user/edit',               // 修改用户信息

    // ===== 公告 =====
    GET_ACTIVE_ANNOUNCEMENT: '/dgq/announcement/active', // 当前生效公告

    // ===== 贴吧 =====
    POST_LIST: '/dgq/Post/list',                         // 帖子分页列表
    POST_LIKE: '/dgq/Post/like',                         // 帖子点赞
    POST_STATEMENT: '/dgq/Post/Statement',               // 帖子表态
    POST_REVIEW_SUBMIT: '/dgq/Post/ReviewPost/submit',   // 帖子审核提交
    POST_SELECT_IS_ME: '/dgq/Post/selectIsMePageList',   // 我的帖子
    POST_COMMENT_LIST: '/dgq/Post/Comment/list',         // 评论列表
    POST_COMMENT_LIKE: '/dgq/Post/Comment/like',         // 评论点赞
    POST_COMMENT_REPLY: '/dgq/Post/Comment/reply',       // 评论回复

    // ===== 系统消息 =====
    GET_LIKE_MSG_LIST: '/dgq/SysMessage/getLikeMsgList', // 点赞消息列表
    GET_MSG_NUM: '/dgq/SysMessage/getMsgNum',            // 未读消息数

    // ===== 成长体系 =====
    GROWTH_ME: '/dgq/growth/me',                         // 我的成长信息
    GROWTH_RANK: '/dgq/growth/rank',                     // 经验排行榜
    GROWTH_MEDALS: '/dgq/growth/medals',                 // 勋章墙

    // ===== 签到 =====
    CHECKIN_SIGN: '/dgq/checkin/sign',                   // 签到
    CHECKIN_STATUS: '/dgq/checkin/status',               // 签到状态
    CHECKIN_WALLET: '/dgq/checkin/wallet',               // 我的钱包
    CHECKIN_REWARD: '/dgq/checkin/reward',               // 打赏

    // ===== 烂度榜 =====
    STALE_VOTE: '/dgq/stale/vote',                       // 烂度投票
    STALE_RANK: '/dgq/stale/rank',                       // 烂度榜

    // ===== 烂梗擂台 =====
    ARENA_CURRENT: '/dgq/arena/current',                 // 今天PK + 本周排行
    ARENA_VOTE: '/dgq/arena/vote',                       // 擂台投票
    ARENA_WEEKLY: '/dgq/arena/weekly',                   // 历史周排行列表
    ARENA_WEEKLY_DETAIL: '/dgq/arena/weekly/',           // 指定周排行详情

    // ===== 生命周期 =====
    LIFECYCLE_DASHBOARD: '/dgq/lifecycle/dashboard',     // 生命周期看板
    LIFECYCLE_STAGE: '/dgq/lifecycle/stage',             // 生命周期分阶段分页

    // ===== 梗DNA v6 =====
    DNA_RELATIONS_V6: '/dgq/dna/v6',                     // 模板优先的梗DNA v6
    DNA_EVOLUTION_V6: '/dgq/dna/v6/',                    // 单梗演化路径

    // ===== 实时热度墙 (SSE) =====
    HOTWALL_STREAM: '/dgq/hotwall/stream',               // 实时热度墙 SSE

    // ===== 词云 =====
    WORD_CLOUD: '/dgq/WordCloud',                        // 首页词云

    // ===== AI 造梗 =====
    AI_CHAT_COMPLETION: '/dgq/douyuEx/completion',       // AI 流式对话

    // ===== 合成猪 (MergePig) =====
    MERGE_PIG_LEADERBOARD: '/machine/merge-pig/leaderboard', // 合成猪排行榜
    MERGE_PIG_MY_RANK: '/machine/merge-pig/rank/',           // 我的合成猪排名 (后接 siteToken)

    // ===== 时光相册 =====
    SHOW_IMAGE: '/dgq/showImage',                        // 相册列表
    ADD_COMMENT: '/dgq/addCommentname',                  // 相册评论

    // ===== 油猴脚本 =====
    GF_PLUGIN_VERSION: '/dgq/gfplugin/version',          // 当前插件版本
} as const;

import all_icon from '@/assets/icons/all_icon.svg';
import home_icon from '@/assets/icons/home_icon.svg';
import image_icon from '@/assets/icons/image_icon.svg';
import dgq_icon from '@/assets/icons/dgq_icon.svg';
import mygo_icon from '@/assets/icons/mygo_icon.svg';
import ZbjHuPen_icon from '@/assets/icons/ZbjHuPen_icon.svg';
import JZ_icon from '@/assets/icons/jz.png';
import Z_icon from '@/assets/icons/Z_icon.png';
import cg_icon from '@/assets/icons/cg.svg';
import install_icon from '@/assets/icons/install_icon.svg';
import chat_icon from '@/assets/icons/chat_icon.svg';
import post_icon from '@/assets/icons/post-bar.svg';
import stale_icon from '@/assets/icons/stale_icon.svg';
import arena_icon from '@/assets/icons/arena_icon.svg';
import lifecycle_icon from '@/assets/icons/lifecycle_icon.svg';
import hotwall_icon from '@/assets/icons/hotwall_icon.svg';

export const MemeCategory = [
    { path: '/home', text: '首页', icon: home_icon },
    { path: '/memes/AllBarrage', text: '全部烂梗', icon: all_icon, api: API.GET_ALL_MEME, category: 'allbarrage' },
    { path: '/Tampermonkey', text: '一键安装插件', icon: install_icon },
    { path: '/image', text: '时光相册', icon: image_icon },
    // { path: '/memes/FKDGQ', text: '喷冬瓜强篇', icon: dgq_icon, api: API.GET_FK_DGQ_MEME, category: 'penDGQ' },
    // { path: '/memes/ZbjHuPen', text: '直播间互喷+1篇', icon: ZbjHuPen_icon, api: API.GET_FK_EACHOTHER_MEME, category: 'ZbjHuPen' },
    // { path: '/memes/XTT', text: '小团体篇', icon: mygo_icon, api: API.GET_XTT_MEME, category: 'XTT' },
    // { path: '/memes/FKchaoge', text: '喷超哥🐘篇', icon: cg_icon, api: API.GET_FK_CHAOGE_MEME, category: 'cg' },
    // { path: '/memes/JZCM2022', text: '警钟长鸣2022', icon: JZ_icon, api: API.GET_JZCM2022_MEME, category: '2022' },
    // { path: '/memes/JZCM2023', text: '警钟长鸣2023', icon: JZ_icon, api: API.GET_JZCM2023_MEME, category: '2023' },
    // { path: '/memes/JZCM2024', text: '警钟长鸣2024', icon: JZ_icon, api: API.GET_JZCM2024_MEME, category: '2024' },
    // { path: '/memes/JZCM2025', text: '警钟长鸣2025', icon: JZ_icon, api: API.GET_JZCM2025_MEME, category: '2025' },
    // { path: '/memes/QUQU', text: 'QUQU篇', icon: Z_icon, api: API.GET_QUQU_MEME, category: 'QUQU' },
    // ===== 新增功能入口 =====
    { path: '/post-bar', text: '社区贴吧', icon: post_icon },
    { path: '/aichat', text: 'AI造梗', icon: chat_icon },
    { path: '/stale', text: '烂度热榜', icon: stale_icon },
    { path: '/arena', text: '烂梗擂台', icon: arena_icon },
    { path: '/lifecycle', text: '梗生命周期', icon: lifecycle_icon },
    { path: '/hotwall', text: '实时热度墙', icon: hotwall_icon },
];

declare global {
    type Meme = {
        tags: string;
        content: string;
        category: string;
        id: string;
        copyCount: number;
        likes: number;
        submitTime?: string;
        hotDateTime?: string;
    };
}
