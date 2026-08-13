<template>
    <div>
        <p class="announcement">
            <b>这是一个收集 63136 冬瓜强直播间烂梗的网站：</b>
            <span class="web-url">
                <a href="https://dgq63136.cn">dgq63136.cn</a>
            </span>
            尽情欣赏你们的烂梗吧。
        </p>
        <p class="sub-info">
            <b>
                <RouterLink to="/Tampermonkey">油猴插件</RouterLink>
                (已支持斗鱼新UI)
                <a href="https://dgq63136.cn/dgq63136.user.js" target="_blank">点击下载</a>
                可在斗鱼直播间一键发送烂梗
            </b>
        </p>
        <p class="sub-info">开放注册功能，可能会出现收不到邮件的情况。</p>
        <!-- <p class="sub-info">目前已支持 63136 冬瓜强直播间开播提醒。加入右侧 qq 交流群可获取开播 q 群@提示</p> -->
        <p class="sub-info">右上角头像内新增签到、梗币、勋章、经验体系
            <RouterLink to="/checkin">每日签到</RouterLink>
        </p>
        <p class="sub-info">想知道某条烂梗衍生出哪些烂梗吗？又跟哪些梗相似吗？
            <RouterLink to="/lifecycle">梗生命周期&DNA</RouterLink>
        </p>
        <p class="sub-info">
            <RouterLink to="/update">网站更新日志</RouterLink>
        </p>
        <el-divider />
        <div class="promotion">
            <div class="title">友情推广</div>
            <a class="partner-card" href="https://sb6657.cn" target="_blank" rel="noopener noreferrer" aria-label="访问 sb6657.cn 玩机器烂梗站">
                <span class="partner-kicker">RELATED SITE // 玩机器</span>
                <span class="partner-name">sb6657.cn</span>
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped lang="scss">
.announcement {
    font-size: 16px;
    margin-bottom: 8px;
    .web-url {
        font-size: 20px;
        font-weight: bold;
        a {
            color: #e6a23c;
        }
    }
}
.sub-info {
    font-size: 14px;
    background-color: var(--card-bg);
    margin: 4px 0;
    a {
        color: #409eff;
    }
}
.promotion {
    .title {
        font-weight: bold;
        margin-bottom: 8px;
    }
    .partner-card {
        display: inline-flex;
        flex-direction: column;
        padding: 8px 14px;
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        color: #303133;
        text-decoration: none;
        background: #fafafa;
        transition: background 0.2s ease;
        &:hover {
            background: #f0f9ff;
        }
        .partner-kicker {
            font-size: 11px;
            color: #909399;
            letter-spacing: 1px;
        }
        .partner-name {
            font-size: 16px;
            font-weight: bold;
            color: #409eff;
            margin-top: 2px;
        }
    }
}
</style>
