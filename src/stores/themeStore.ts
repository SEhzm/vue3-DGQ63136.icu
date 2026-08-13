import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'theme-mode';

function getSystemDark(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const useThemeStore = defineStore('theme', () => {
    const mode = ref<ThemeMode>(
        (localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'system'
    );

    const isDark = computed(() => {
        if (mode.value === 'system') return getSystemDark();
        return mode.value === 'dark';
    });

    let mediaQuery: MediaQueryList | null = null;
    let mediaListener: (() => void) | null = null;

    function apply() {
        document.documentElement.classList.toggle('dark', isDark.value);

        // 仅在 system 模式时监听 OS 主题变化
        if (mode.value === 'system') {
            if (!mediaQuery) {
                mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                mediaListener = () => {
                    document.documentElement.classList.toggle('dark', mediaQuery!.matches);
                };
                mediaQuery.addEventListener('change', mediaListener);
            }
        } else {
            if (mediaQuery && mediaListener) {
                mediaQuery.removeEventListener('change', mediaListener);
                mediaQuery = null;
                mediaListener = null;
            }
        }
    }

    function setMode(m: ThemeMode) {
        mode.value = m;
        localStorage.setItem(STORAGE_KEY, m);
        apply();
    }

    // 初始化时立即 apply
    apply();

    // 监听 mode 变更以重新 apply（处理 listener 注册/注销）
    watch(mode, () => {
        apply();
    });

    return {
        mode,
        isDark,
        setMode,
        apply,
    };
});
