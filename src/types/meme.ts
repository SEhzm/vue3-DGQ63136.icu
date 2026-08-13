/**
 * 与 sb6657 frontend 一致的全局 Meme 类型 + 接口响应辅助类型。
 * 兼容 DGQ 旧版结构（tags/content/category/id/copyCount/likes），并补 submitTime / hotDateTime。
 */

export interface HotMemeItem {
    tags: string;
    barrage: string;
    barrageId: number;
    cnt: number;
    hotDateTime?: string | null;
    id?: number | null;
    tableName?: string;
    likes?: number;
}

export interface HotMemeResponse {
    code: number;
    msg: string;
    data: HotMemeItem[];
}

export interface MemeListMeme {
    tags: string;
    id: string;
    barrage: string;
    cnt: string;
    likes: string;
    submitTime?: string;
}

export interface MemeListData {
    total: number;
    list: MemeListMeme[];
    pageNum: number;
    pageSize: number;
}

export interface MemeListResponse {
    code: number;
    msg: string;
    data: MemeListData;
}

export interface SearchMemeData {
    tags: string;
    barrage: string;
    cnt: string;
    id: string;
    likes: string;
}

export interface SearchMemeResponse {
    code: number;
    data: SearchMemeData[];
    msg: string;
}

export interface SearchMemeRequest {
    barrage: string;
    tags?: string;
    sort?: string;
    pageNum?: number;
    pageSize?: number;
    submitTime?: string;
}

export interface MemeTag {
    dictCode: string;
    dictLabel: string;
    dictValue: string;
    dictType: string;
    iconUrl?: string;
}

export enum SortType {
    ID = 'id',
    TIME = 'time',
    LIKES = 'likes',
    COPY = 'cnt',
}

export type getMemeTags = MemeTag;
export type getMemeList_meme = MemeListMeme;
