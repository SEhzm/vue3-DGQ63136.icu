import { ref } from 'vue';

/**
 * 全局合成大猪头游戏弹窗可见性。
 * 由 MergePigLauncher 写入，由 MergePigDialog 读取。
 */
export const mergePigDialogVisible = ref(false);