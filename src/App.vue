<template>
    <div>
        <RouterView />
        <StarrySky class="starrySky" />
        <IdleScreensaver />
        <AnnouncementDialog />
        <MergePigLauncher />
        <MergePigDialog />
    </div>
</template>

<script setup lang="ts">
import StarrySky from '@/views/Starrysky.vue';
import IdleScreensaver from '@/views/IdleScreensaver.vue';
import AnnouncementDialog from '@/components/AnnouncementDialog.vue';
import MergePigLauncher from '@/components/MergePig/MergePigLauncher.vue';
import MergePigDialog from '@/components/MergePig/MergePigDialog.vue';
import { useThemeStore } from '@/stores/themeStore';
import { onMounted } from 'vue';

const theme = useThemeStore();
onMounted(() => {
    theme.init();
});
</script>

<style scoped lang="scss">
@media (max-width: 600px) {
    .starrySky {
        display: none;
    }
}
</style>
