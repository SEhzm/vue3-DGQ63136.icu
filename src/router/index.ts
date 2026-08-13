import { createRouter, createWebHashHistory } from 'vue-router';
import NotFoundView from '@/views/404.vue';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'MainLayout',
            component: () => import('@/views/MainLayout/MainLayout.vue'),
            redirect: '/home',
            children: [
                // 基础页面
                { path: 'home', name: 'Home', component: () => import('@/views/MainLayout/components/Home.vue') },
                { path: 'ChatRoom', name: 'ChatRoom', component: () => import('@/components/ChatRoom.vue') },
                { path: 'image', name: 'image', component: () => import('@/views/MainLayout/components/image.vue') },
                { path: 'test', name: 'test', component: () => import('@/views/MainLayout/components/test.vue') },
                { path: 'test2', name: 'test2', component: () => import('@/views/MainLayout/components/test2.vue') },
                { path: 'Starrysky', name: 'Starrysky', component: () => import('@/views/Starrysky.vue') },
                { path: 'Tampermonkey', name: 'Tampermonkey', component: () => import('@/views/MainLayout/components/Tampermonkey.vue') },
                { path: 'audioPlayer', name: 'audioPlayer', component: () => import('@/components/audioPlayer.vue') },
                { path: 'memes/:category', name: 'memes', component: () => import('@/views/MainLayout/components/memes-view.vue') },

                // ===== 社区 =====
                { path: 'post-bar', name: 'post-bar', component: () => import('@/views/MainLayout/components/post-bar/post-bar-main.vue') },
                { path: 'me-post', name: 'me-post', component: () => import('@/views/MainLayout/components/post-bar/Me-Post.vue') },
                { path: 'me-msg', name: 'me-msg', component: () => import('@/views/MainLayout/components/post-bar/Post-Message.vue') },

                // ===== 用户中心 =====
                { path: 'UserInfo', name: 'UserInfo', component: () => import('@/views/MainLayout/components/user/components/index.vue') },
                { path: 'me-memes', name: 'me-memes', component: () => import('@/views/MainLayout/components/user/components/Me-memes.vue') },

                // ===== AI 造梗 =====
                { path: 'aichat', name: 'AIChat', component: () => import('@/views/MainLayout/components/AiGenerateMemes/AIChat.vue') },

                // ===== 更新日志 =====
                { path: 'update', name: 'update-timeline', component: () => import('@/views/MainLayout/components/update-timeline.vue') },

                // ===== 烂度 / 擂台 / 实时热度墙 =====
                { path: 'stale', name: 'stale', component: () => import('@/views/MainLayout/components/stale-hot/stale.vue') },
                { path: 'hotwall', name: 'hotwall', component: () => import('@/views/MainLayout/components/stale-hot/hotwall.vue') },
                { path: 'arena', name: 'arena', component: () => import('@/views/MainLayout/components/play/arena.vue') },
                { path: 'growth', name: 'growth', component: () => import('@/views/MainLayout/components/play/growth.vue') },

                // ===== 签到 / 生命周期 =====
                { path: 'lifecycle', name: 'lifecycle', component: () => import('@/views/MainLayout/components/keep/lifecycle.vue') },
                { path: 'checkin', name: 'checkin', component: () => import('@/views/MainLayout/components/keep/checkin.vue') },
            ],
        },
        {
            path: '/:catchAll(.*)', // 使用正则表达式捕获所有路径
            name: 'NotFound',
            component: NotFoundView,
        },
    ],
});

export default router;
