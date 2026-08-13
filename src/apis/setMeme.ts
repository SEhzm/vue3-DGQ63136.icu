import httpInstance from '@/apis/httpInstance';
import { API } from '@/constants/backend';
import { ElNotification } from 'element-plus';

interface SimpleRes {
    code: number;
    data: object;
    msg: string;
}

export async function copyCountPlus1(category: string, memeId: string, pageNum?: number, PageSize?: number, sortOrder?: string) {
    try {
        const res: SimpleRes = await httpInstance.get(API.INCREASE_COPY_COUNT + `/${memeId}`);
        console.log('弹幕复制次数+1成功', res);
        return true;
    } catch (err: any) {
        console.error('弹幕复制次数+1失败', err);
        return false;
    }
}

/**
 * post-bar 里复制弹幕时调用的别名
 */
export async function postCopy(memeId: string, category?: string, pageNum?: number, PageSize?: number, sortOrder?: string) {
    return copyCountPlus1(category || 'allbarrage', memeId, pageNum, PageSize, sortOrder);
}

export async function likeCountPlus1(memeId: string, category?: string, pageNum?: number, PageSize?: number, sortOrder?: string) {
    try {
        const res: SimpleRes = await httpInstance.get(API.INCREASE_LIKE_COUNT + `/${memeId}`);
        console.log('弹幕点赞次数+1成功', res);
        return true;
    } catch (err: any) {
        console.error('弹幕点赞次数+1失败', err);
        return false;
    }
}

export function plus1Error() {
    ElNotification({
        title: '复制成功',
        message: '但是复制次数没有增加，可能是网络有问题',
        type: 'warning',
    });
}

export function likePlus1Error() {
    ElNotification({
        title: '点赞成功👍',
        message: '但是点赞次数没有增加，可能是网络有问题',
        type: 'warning',
    });
}

interface submitMemeRes {
    code: number;
    msg: string;
    data: object;
}

export async function submitMeme(category: string, meme: string, tags?: string) {
    console.log(`烂梗投稿\n 所属分类: ${category} \n烂梗内容: ${meme}`);
    try {
        const payload: any = { barrage: meme };
        if (tags) {
            payload.tags = tags;
        } else {
            payload.table = category;
        }
        const res: submitMemeRes = await httpInstance.post(API.SUBMIT_MEME, payload);
        if (res.code === 500) {
            ElNotification({
                title: '烂梗已经有了',
                message: '勿重复提交',
                type: 'error',
            });
            return false;
        } else if (res.code !== 200) {
            return false;
        }
        return true;
    } catch (err: any) {
        console.error('烂梗投稿失败', err);
        return false;
    }
}
