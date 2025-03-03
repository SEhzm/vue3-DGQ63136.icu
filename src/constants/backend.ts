export const SERVER_ADDRESS = 'https://hguofichp.cn:10086';

export const API = {
    INCREASE_COPY_COUNT: '/dgq/addCnt',             // 增加复制次数
    INCREASE_LIKE_COUNT: '/dgq/like',               // 增加复制次数
    GET_HOT_MEME_24h: '/dgq/hotBarrageOf24H',       // 获取24小时热门烂梗
    GET_HOT_MEME_7D: '/dgq/hotBarrageOf7Day',       // 获取7天热门烂梗
    SEARCH_MEME: '/dgq/Query',                      // 根据关键词搜索烂梗
    GET_ALL_MEME: '/dgq/Page?tags=1000',            // 获取全部烂梗分页
    GET_SORTED_ALL_MEME: '/dgq/sortAllBarrage',     // 获取排序后的全部烂梗
    GET_FK_DGQ_MEME: '/dgq/Page?tags=01',           // 获取喷冬瓜强篇烂梗1
    GET_FK_CHAOGE_MEME: '/dgq/Page?tags=07',        // 获取喷超哥篇烂梗7
    GET_XTT_MEME: '/dgq/Page?tags=08',              // 获取XTT篇烂梗8
    GET_FK_EACHOTHER_MEME: '/dgq/Page?tags=00',     // 获取直播间互喷篇烂梗0
    GET_QUQU_MEME: '/dgq/Page?tags=06',             // 获取QUQU篇烂梗6
    GET_JZCM2022_MEME: '/dgq/Page?tags=02',         // 获取2022篇烂梗2
    GET_JZCM2023_MEME: '/dgq/Page?tags=03',         // 获取2023篇烂梗3
    GET_JZCM2024_MEME: '/dgq/Page?tags=04',         // 获取2024篇烂梗4
    GET_JZCM2025_MEME: '/dgq/Page?tags=05',         // 获取2025篇烂梗5
    GET_RAND_ONE_MEME: '/dgq/getRandOne',           // 随机一条烂梗
    SUBMIT_MEME: '/dgq/submission',                 // 烂梗投稿
} as const;

import home_icon from '@/assets/icons/home_icon.svg';
import all_icon from '@/assets/icons/all_icon.svg';
import image_icon from '@/assets/icons/image_icon.svg';
import dgq_icon from '@/assets/icons/dgq_icon.svg';
import mygo_icon from '@/assets/icons/mygo_icon.svg';
import ZbjHuPen_icon from '@/assets/icons/ZbjHuPen_icon.svg';
import JZ_icon from '@/assets/icons/jz.png';
import Z_icon from '@/assets/icons/Z_icon.png';
import cg_icon from '@/assets/icons/cg.svg';
export const MemeCategory = [
    { path: '/home', text: '首页', icon: home_icon },
    { path: '/memes/AllBarrage', text: '全部烂梗', icon: all_icon, api: API.GET_ALL_MEME, category: 'allbarrage' },
    { path: '/image', text: '时光相册', icon: image_icon },
    { path: '/memes/FKDGQ', text: '喷冬瓜强篇', icon: dgq_icon, api: API.GET_FK_DGQ_MEME, category: 'penDGQ' },
    { path: '/memes/ZbjHuPen', text: '直播间互喷+1篇', icon: ZbjHuPen_icon, api: API.GET_FK_EACHOTHER_MEME, category: 'ZbjHuPen' },
    { path: '/memes/XTT', text: '小团体篇', icon: mygo_icon, api: API.GET_XTT_MEME, category: 'XTT' },
    { path: '/memes/FKchaoge', text: '喷超哥🐘篇', icon: cg_icon, api: API.GET_FK_CHAOGE_MEME, category: 'cg' },
    { path: '/memes/JZCM2022', text: '警钟长鸣2022', icon: JZ_icon, api: API.GET_JZCM2022_MEME, category: '2022' },
    { path: '/memes/JZCM2023', text: '警钟长鸣2023', icon: JZ_icon, api: API.GET_JZCM2023_MEME, category: '2023' },
    { path: '/memes/JZCM2024', text: '警钟长鸣2024', icon: JZ_icon, api: API.GET_JZCM2024_MEME, category: '2024' },
    { path: '/memes/JZCM2025', text: '警钟长鸣2025', icon: JZ_icon, api: API.GET_JZCM2025_MEME, category: '2025' },
    { path: '/memes/QUQU', text: 'QUQU篇', icon: Z_icon, api: API.GET_QUQU_MEME, category: 'QUQU' },
];

declare global {
    type Meme = {
        tags: string; //tags
        content: string; // 梗内容
        category: string; // 分类
        id: string; // ID
        copyCount: number; // 复制次数
        likes: number; //点赞次数
    };
}
