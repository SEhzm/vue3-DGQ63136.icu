import { defineStore } from 'pinia';

export type ThemeMode = 'light' | 'dark' | 'auto';

export const useThemeStore = defineStore('theme', {
    state: () => ({
        mode: ((typeof localStorage !== 'undefined' && (localStorage.getItem('theme-mode') as ThemeMode)) || 'light') as ThemeMode,
    }),
    actions: {
        setMode(mode: ThemeMode) {
            this.mode = mode;
            try {
                localStorage.setItem('theme-mode', mode);
            } catch (e) {
                /* localStorage 不可用时静默 */
            }
            this.applyToDom();
        },
        applyToDom() {
            const html = document.documentElement;
            html.classList.remove('dark', 'theme-light', 'theme-auto');
            if (this.mode === 'dark') {
                html.classList.add('dark');
            } else if (this.mode === 'auto') {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (isDark) html.classList.add('dark');
                html.classList.add('theme-auto');
            } else {
                html.classList.add('theme-light');
            }
        },
        init() {
            this.applyToDom();
        },
    },
});
