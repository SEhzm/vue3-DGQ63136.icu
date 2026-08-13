import { defineStore } from 'pinia';
import httpInstance from '@/apis/httpInstance';
import { API } from '@/constants/backend';

interface MemeTag {
    dictCode: string;
    dictLabel: string;
    dictValue: string;
    dictType: string;
    iconUrl?: string;
}

export const useMemeTagsStore = defineStore('memeTags', {
    state: () => ({
        tags: [] as MemeTag[],
        tagsLoaded: null as Promise<void> | null,
    }),
    actions: {
        async setMemeTags() {
            // 用 Promise 缓存避免并发重复请求
            if (!this.tagsLoaded) {
                this.tagsLoaded = (async () => {
                    try {
                        const res: any = await httpInstance.get(API.GET_MEME_TAGS);
                        if (res?.code === 200 && Array.isArray(res.data)) {
                            this.tags = res.data;
                        }
                    } catch (e) {
                        console.warn('加载烂梗标签失败', e);
                    }
                })();
            }
            return this.tagsLoaded;
        },
    },
});
