import { defineStore } from 'pinia';

export const useGuiBinStore = defineStore('guibin', {
    state: () => ({
        Oni: 0 as number,
    }),
    actions: {
        setOni(value: number) {
            this.Oni = value;
        },
    },
});
