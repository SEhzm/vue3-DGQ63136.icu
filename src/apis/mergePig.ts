import { get } from './httpInstance';

export interface MergePigLeaderboardItem {
    id: number;
    nickname: string | null;
    score: number;
    level: number;
    win: boolean;
    createTime: string;
}

export interface MergePigRankInfo {
    bestScore: number;
    rank: number;
}

/**
 * 拉取前 N 名排行榜
 * 后端返回统一包装 { code, data, msg }，data 是数组
 */
export async function fetchMergePigLeaderboard(top = 100): Promise<MergePigLeaderboardItem[]> {
    const res = await get<MergePigLeaderboardItem[]>(`/dgq/merge-pig/leaderboard?top=${top}`);
    return res.flatData ?? [];
}

/** 拉取个人排名与最高分 */
export async function fetchMergePigRank(siteToken: string): Promise<MergePigRankInfo> {
    const res = await get<MergePigRankInfo>(`/dgq/merge-pig/rank/${encodeURIComponent(siteToken)}`);
    return res.flatData ?? { bestScore: 0, rank: -1 };
}
