import { ref, onMounted, onBeforeUnmount } from 'vue';

/**
 * 响应式判断当前是否移动端（≤600px）。
 * 在 SSR 或无 window 的环境下返回 false。
 */
export function useIsMobile(breakpoint: number = 600) {
    const isMobile = ref(false);
    let mq: MediaQueryList | null = null;

    const update = (e?: MediaQueryListEvent | MediaQueryList) => {
        const target = (e as MediaQueryList | undefined) ?? mq;
        if (target) isMobile.value = target.matches;
    };

    onMounted(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
            isMobile.value = false;
            return;
        }
        mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
        isMobile.value = mq.matches;
        if (mq.addEventListener) {
            mq.addEventListener('change', update);
        } else if ((mq as any).addListener) {
            (mq as any).addListener(update);
        }
    });

    onBeforeUnmount(() => {
        if (!mq) return;
        if (mq.removeEventListener) {
            mq.removeEventListener('change', update);
        } else if ((mq as any).removeListener) {
            (mq as any).removeListener(update);
        }
    });

    return isMobile;
}
