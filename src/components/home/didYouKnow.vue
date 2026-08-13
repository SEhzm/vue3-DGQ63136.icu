<template>
    <div class="home-info-modules">
        <section class="info-module">
            <h3>🤔 你知道吗？</h3>
            <ul class="module-list">
                <li>
                    63136 冬瓜强直播间已经积攒了上千条经典烂梗
                    <RouterLink to="/memes/AllBarrage">- 全部烂梗</RouterLink>
                </li>
                <li>
                    想知道某条烂梗衍生出哪些烂梗吗？又跟哪些梗相似吗？
                    <RouterLink to="/lifecycle">- 梗生命周期&DNA</RouterLink>
                </li>
                <li>
                    烂梗擂台每周一换，烂梗也有江湖地位
                    <RouterLink to="/arena">- 烂梗擂台</RouterLink>
                </li>
                <li>
                    签到 / 投梗 攒经验，勋章等你拿
                    <RouterLink to="/checkin">- 每日签到</RouterLink>
                </li>
            </ul>
        </section>

        <el-divider class="module-divider" />

        <section class="info-module">
            <div class="latest-meme">
                <div class="line-top">
                    <span class="total">
                        共有
                        <span class="total-count">{{ lastMeme.total }}</span>
                        条烂梗
                    </span>
                    <span class="submit-time">最后投稿时间：{{ lastMeme.time }}</span>
                </div>
                <div class="line-bottom">
                    <span class="label">最新投稿烂梗：</span>
                    <span class="copy-hint">(点击可复制)</span>
                    <ElTooltip :trigger="isMobile ? 'click' : 'hover'" placement="top" effect="light">
                        <template #content>
                            <div class="tooltip-content">
                                <div v-if="lastMeme.tags && lastMeme.tags.length" class="tags-container">
                                    <div v-for="(item, index) in lastMeme.tags" :key="index" class="modern-tag">
                                        <img v-if="item.iconUrl" :src="item.iconUrl" class="tag-icon" />
                                        <span class="tag-label">{{ item.label }}</span>
                                    </div>
                                </div>
                                <div class="copy-count">复制次数：{{ lastMeme.copy }}</div>
                            </div>
                        </template>
                        <span class="meme-text" :class="{ clicked: isClicked }" @click="handleCopyLatestMeme">{{ lastMeme.meme }}</span>
                    </ElTooltip>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { getMemeList } from '@/apis/getMeme';
import { useMemeTagsStore } from '@/stores/memeTags';
import { useIsMobile } from '@/composables/useIsMobile';
import { ElTooltip, ElNotification, ElDivider } from 'element-plus';
import { copyToClipboard } from '@/utils/clipboard';
import { formatDate } from '@/utils/time';

const isMobile = useIsMobile();
const memeTagsStore = useMemeTagsStore();
const memeTags = ref<any[]>([]);
memeTagsStore.setMemeTags().then(() => {
    memeTags.value = memeTagsStore.tags as any[];
});

const lastMeme = reactive({
    time: '',
    meme: '',
    tags: [] as { label: string; iconUrl: string }[],
    copy: 0,
    total: 0,
});

function getDisplayTags(tagsStr: string) {
    if (!tagsStr) return [];
    const list = Array.from(new Set(tagsStr.split(',').map((t) => t.trim())));
    return list.map((v) => {
        const dictItem = memeTags.value.find((it) => String(it.dictValue).trim() === v);
        return dictItem ? { label: dictItem.dictLabel, iconUrl: dictItem.iconUrl } : { label: v, iconUrl: '' };
    });
}

async function getLastMeme() {
    const res: any = await getMemeList('allbarrage', 1, 1);
    if (!res || !res.memeArr || !res.memeArr[0]) return;
    lastMeme.time = res.memeArr[0].submitTime ? formatDate(res.memeArr[0].submitTime) : '';
    lastMeme.meme = res.memeArr[0].content;
    lastMeme.tags = getDisplayTags(res.memeArr[0].tags);
    lastMeme.copy = res.memeArr[0].copyCount;
    lastMeme.total = res.total;
}
getLastMeme();

const isClicked = ref(false);
function handleCopyLatestMeme() {
    if (!lastMeme.meme) return;
    copyToClipboard(lastMeme.meme);
    ElNotification({ message: '复制成功', type: 'success' });
    isClicked.value = true;
    setTimeout(() => {
        isClicked.value = false;
    }, 1200);
}
</script>

<style scoped lang="scss">
.home-info-modules {
    .info-module {
        color: var(--body-color);
        font-size: 14px;
        line-height: 1.6;

        h3 {
            margin: 0 0 12px;
            color: var(--body-color);
            font-size: 18px;
            font-weight: 600;
        }

        a {
            color: #409eff;
            font-weight: 500;
            text-decoration: none;
            white-space: nowrap;
            &:hover {
                color: #66b1ff;
                text-decoration: underline;
            }
        }
    }
    .module-list {
        list-style: none;
        margin: 0;
        padding: 0;
        li {
            margin-bottom: 8px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
    :deep(.module-divider) {
        margin: 8px 0;
    }
}
.latest-meme {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    .line-top {
        display: inline-flex;
        gap: 8px;
        align-items: baseline;
        white-space: nowrap;
        .total {
            color: var(--body-color);
            font-weight: 600;
            .total-count {
                color: cadetblue;
            }
        }
        .submit-time {
            color: var(--body-color);
            font-size: x-small;
        }
    }
    .line-bottom {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 6px;
    }
    .label {
        font-weight: 600;
        color: var(--body-color);
    }
    .copy-hint {
        color: var(--body-color);
        font-size: 12px;
        font-style: italic;
    }
    .meme-text {
        color: var(--body-color);
        cursor: pointer;
        text-decoration: underline;
        text-decoration-style: dashed;
        text-underline-offset: 2px;
        &:hover {
            color: #409eff;
        }
        &.clicked {
            color: #409eff;
        }
    }
}
.tooltip-content {
    max-width: 480px;
    .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 6px;
    }
    .modern-tag {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        background: var(--el-fill-color-light, #e7f6f3);
        border: none;
        border-radius: 50px;
        padding: 3px 6px;
        font-size: 12px;
        color: var(--el-color-primary);
        .tag-icon {
            width: 22px;
            height: 22px;
            object-fit: contain;
        }
    }
    .copy-count {
        font-size: 12px;
        color: var(--body-color);
    }
}
@media (max-width: 768px) {
    .latest-meme {
        font-size: 12px;
    }
}
</style>
