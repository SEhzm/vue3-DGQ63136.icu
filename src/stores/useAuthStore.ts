import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        loginVisible: false as boolean,
        userId: null as number | string | null,
    }),
    actions: {
        showLogin() {
            this.loginVisible = true;
        },
        hideLogin() {
            this.loginVisible = false;
        },
        setUserId(id: number | string | null) {
            this.userId = id;
        },
    },
});
