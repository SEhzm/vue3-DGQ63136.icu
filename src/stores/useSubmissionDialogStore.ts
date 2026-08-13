import { defineStore } from 'pinia';

export const useSubmissionDialogStore = defineStore('submissionDialog', {
    state: () => ({
        visible: false as boolean,
    }),
    actions: {
        open() {
            this.visible = true;
        },
        close() {
            this.visible = false;
        },
    },
});
