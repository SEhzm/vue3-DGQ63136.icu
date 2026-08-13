<template>
    <div class="boomouder">
        <img src="https://pic1.imgdb.cn/item/67c4818fd0e0a243d40a35d1.jpg" alt="63136banner"
            class="boom6657">
    </div>
    <div class="home">
        <div class="cards-container">
            <div class="card first-card">
                <HomeIntro />
            </div>
            <div class="card second-card">
                <DidYouKnow />
            </div>
        </div>

        <div class="card third-card">
            <RandomMeme />
        </div>

        <div class="card fourth-card">
            <div>
                <el-input v-model="searchQuery" :placeholder="searchBarrageMeg" @keydown.enter="queryBarrage" clearable
                    class="search-input" @input="onSearchQueryChange">
                    <template #append>
                        <el-button type="primary" @click="queryBarrage">
                            <el-icon>
                                <Search />
                            </el-icon>
                        </el-button>
                    </template>
                </el-input>
                <el-table v-loading="loading" v-if="isInput" :data="data.filteredItems" stripe @row-click="copyText"
                    :cell-style="{ cursor: 'Pointer', fontSize: 'large' }">
                    <el-table-column prop="barrage">
                        <template #default="scope">
                            <el-popover placement="top" :width="'auto'" trigger="hover"
                                :popper-class="customPopoverClass">
                                <template #reference>
                                    <div style="cursor: pointer;">
                                        <span class="barrage-text">{{ scope.row.barrage }}</span>
                                    </div>
                                </template>
                                <template #default>
                                    <div style="display: flex; align-items: center; flex-wrap: wrap;">
                                        <div v-for="(item, index) in getDictLabel(scope.row.tags)" :key="index"
                                            style="margin-right: 8px;">
                                            <el-tag round effect="dark"
                                                :style="{ fontSize: '16px', cursor: 'pointer' }">
                                                <img v-if="item.iconUrl" :src="item.iconUrl"
                                                    style=" width: 16px; height: 16px; object-fit: cover;vertical-align: middle;" />
                                                {{ item.label }}
                                            </el-tag>
                                        </div>
                                    </div>
                                </template>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="100">
                        <template #default="scope">
                            <el-button type="primary" class="copy-btn" @click.stop="copyMeme_countPlus1(scope.row)">复制
                                🎈<flip-num :num="scope.row.cnt" /></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="card fifth-card">
            <div>
                <span>可选标签 <span>———可以选择1~5个标签————</span>
                    <el-popover :width="300">
                        <template #reference>
                            <el-icon size="16">
                                <Warning />
                            </el-icon>
                        </template>
                        为解决烂梗分栏不足和分类不清晰问题。<br>
                        <b>点击标签即可添加</b>
                    </el-popover>
                </span>

                <div class="preset-tags-container">
                    <div class="preset-tags">
                        <el-tag round v-for="(tag, index) in presetTags" :key="index" closable
                            @close="removeTagFromPreset(tag)" @click="removeTagFromPreset(tag)"
                            style=" padding:15px; cursor: pointer;font-size: 16px;" type="primary">
                            {{ tag.label }}
                        </el-tag>
                    </div>
                </div>

                <span>已选标签
                    <el-popover :width="250">
                        <template #reference>
                            <el-icon size="16">
                                <Warning />
                            </el-icon>
                        </template>
                        <b>最少一个标签，最多五个标签。</b>
                    </el-popover>
                </span>

                <div class="added-tags">
                    <el-tag round v-for="(tag, index) in addedTags" :key="index" closable @click="removeTag(tag)"
                        @close="removeTag(tag)" style="padding:15px; cursor: pointer;font-size: 16px;" effect="dark">
                        {{ tag.label }}
                    </el-tag>
                </div>
                <el-input v-model="barrage" maxlength="255" autocomplete="off" :autosize="{ minRows: 2, maxRows: 4 }"
                    show-word-limit type="textarea" placeholder=" 烂梗...."></el-input>
                <el-button class="saveBnt" type="primary" @click="saveBarrage">投稿</el-button>
            </div>
            <el-backtop :right="50" :bottom="50" />
        </div>
        <ChatRoom class="ChatRoom card"></ChatRoom>
        <div class="card sixth-card">
            友情链接 <a href="https://sb6657.cn" target="_blank">sb6657.cn</a>&nbsp;&nbsp;&nbsp;
            <a href="https://dgq63136.cn/#/Starrysky" target="_blank">星空背景</a>&nbsp;&nbsp;&nbsp;
            <a href="https://cdn.hguofichp.cn/dgq63136.user.js" target="_blank">油猴插件</a>
        </div>
    </div>
</template>


<script setup>
import { ref, reactive } from 'vue';
import httpInstance from "@/apis/httpInstance";
import { ElNotification } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { throttle } from '@/utils/throttle';
import { copyToClipboard, copySuccess, limitedCopy, limitedLike } from '@/utils/clipboard';
import { likeCountPlus1 } from '@/apis/setMeme';
import flipNum from '@/components/flip-num.vue';
import ChatRoom from '@/components/ChatRoom.vue';
import HomeIntro from '@/components/home/homeIntro.vue';
import DidYouKnow from '@/components/home/didYouKnow.vue';
import RandomMeme from '@/components/home/random-meme.vue';
import { API } from '@/constants/backend';
const customPopoverClass = 'custom-popover';

const loading = ref(true);
const isInput = ref(false);
const data = reactive({
    filteredItems: [],
    barrage: '',
});
const dictData = ref([]);

const getDict = () => {
    httpInstance.get('/dgq/dictList').then(res => {
        if (res.code === 200) {
            dictData.value = res.data;
            presetTags.value = res.data.map(item => ({
                label: item.dictLabel,
                value: item.dictValue,
                iconUrl: item.iconUrl || '',
            }));
        }
    }).catch(err => {
        console.error('获取字典数据失败', err);
    });
};
const getDictLabel = (tags) => {
    if (!tags || tags.trim() === '') {
        return [];
    }
    const tagList = Array.from(new Set(tags.split(',').map(tag => tag.trim())));
    if (!dictData.value || !dictData.value.length) {
        return tagList.map(() => ({ label: '', iconUrl: '' }));
    }
    const dictMap = new Map(
        dictData.value.map(item => [String(item.dictValue).trim(), item])
    );
    const labels = tagList.map(tag => {
        const dictItem = dictMap.get(tag);
        return dictItem ? { label: dictItem.dictLabel, iconUrl: dictItem.iconUrl } : { label: '', iconUrl: '' };
    });

    return labels;
};

getDict();

const searchQuery = ref('');
const barrage = ref('');
const presetTags = ref([]);
const addedTags = ref([]);
const addedDictValues = ref([]);

const removeTag = (tag) => {
    addedTags.value = addedTags.value.filter(t => t.value !== tag.value);
    addedDictValues.value = addedDictValues.value.filter(value => value !== tag.value);
    presetTags.value.push(tag);
};

const removeTagFromPreset = (tag) => {
    if (addedDictValues.value.length >= 5) {
        ElNotification.info("最多5个标签");
        return;
    }
    if (!addedTags.value.some(t => t.value === tag.value)) {
        addedTags.value.push(tag);
        addedDictValues.value.push(tag.value);
        presetTags.value = presetTags.value.filter(t => t.value !== tag.value);
    }
};

const saveBarrage = () => {
    if (addedDictValues.value.length === 0 || !barrage.value) {
        ElNotification.error("请选择标签或输入弹幕");
        return;
    }
    if (addedDictValues.value.length > 5) {
        ElNotification.error('最少一个标签，最多五个标签。');
        return;
    }
    httpInstance.post(API.SUBMIT_MEME, {
        tags: addedDictValues.value.join(','),
        barrage: barrage.value
    }).then(res => {
        barrage.value = '';
        if (res.code === 200) {
            ElNotification.success("投稿成功，待审核(一天内)");
        } else if (res.code === 500) {
            ElNotification.error("烂梗已经有了，勿重复提交");
        } else {
            ElNotification.error("请求失败");
        }
    }).catch(err => {
        console.error('投稿失败', err);
        ElNotification.error("请求失败");
    });
};

const queryBarrage = () => {
    httpInstance.post('/dgq/Query', {
        barrage: searchQuery.value
    }).then(res => {
        isInput.value = true;
        loading.value = false;
        data.filteredItems = res.data || [];
    });
};

const searchBarrageMeg = ref('搜索烂梗...');

const onSearchQueryChange = () => {
    data.filteredItems = [];
    isInput.value = false;
};

const copyText = (row) => {
    const textToCopy = row.barrage;
    let tempInput = document.createElement('input');
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        document.execCommand('Copy');
        ElNotification({ message: '复制成功', type: 'success' });
        httpInstance.get('/dgq/addCnt/' + row.id).then(() => {});
    } catch (err) {
        ElNotification({ title: '复制失败', message: '复制操作失败，请稍后重试', type: 'error' });
    }
    document.body.removeChild(tempInput);
};

const copyMeme = throttle(copyToClipboard, limitedCopy, 2000);

async function copyMeme_countPlus1(meme) {
    const memeText = meme.barrage;
    const res = copyMeme(memeText);
    if (!res || res === 'limitedSuccess') return;
    copySuccess();
    httpInstance.get(API.INCREASE_COPY_COUNT + '/' + meme.id);
    queryBarrage();
}
</script>

<style scoped lang="scss">
.preset-tags-container {
    max-height: 75px;
    overflow-y: auto;
    margin-top: 10px;
    margin-bottom: 20px;
}

.preset-tags {
    display: flex;
    flex-wrap: wrap;
}

.preset-tags .el-tag {
    position: relative;
    margin-right: 10px;
    margin-bottom: 10px;
}

::v-deep .preset-tags .el-tag__close {
    font-size: 30px;
    transform: rotate(45deg);
}

.added-tags {
    display: flex;
    flex-wrap: wrap;
}

.added-tags .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
}

.custom-popover {
    background-color: #f0f9eb;
    border: 1px solid #e1f3d8;
    border-radius: 4px;
    padding: 10px;
}

.boomouder {
    height: 150px;
    .boom6657 {
        left: calc(50vw - 153px);
        position: absolute;
        height: 150px;
        border-radius: 10px;
    }
}

.home {
    height: auto;
    width: 90%;

    .card {
        line-height: 25px;

        &.first-card {
            margin-top: 10px;
        }

        &.second-card {
            margin-top: 8px;
        }

        &.third-card {
            margin-top: 8px;
        }

        &.fourth-card {
            margin-top: 10px;
            line-height: 50px;
            margin-bottom: 0px;
        }

        &.fifth-card {
            margin-top: 8px;

            .saveBnt {
                margin-left: 40%;
                width: 100px;
                margin-top: 10px;
            }
        }

        &.sixth-card {
            margin-top: 10px;
        }
    }

    .barrage-table {
        font-family: 微软雅黑;
        font-size: 20px;
        cursor: pointer;

        ::v-deep(.el-table__header-wrapper) {
            font-size: 14px;
            white-space: normal !important;
        }
    }

    .search-input {
        font-size: 16px;
    }
}

@media (min-width: 601px) {
    .ChatRoom {
        display: none;
    }
}

@media(max-width :600px) {
    .boomouder {
        height: 150px;
        .boom6657 {
            position: absolute;
            border-radius: 10px;
            width: 192px;
            height: 108px;
            left: 25%;
        }
    }
    .home {
        width: 100%;
    }
    .ChatRoom {
        margin: 10px 0;
    }
}
</style>
