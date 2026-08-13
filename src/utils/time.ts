/**
 * 把毫秒时间戳格式化为 "yyyy-MM-dd HH:mm:ss"。
 */
export function formatDateTime(ts: number | string | Date): string {
    const d = ts instanceof Date ? ts : new Date(ts);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * 把毫秒时间戳格式化为 "MM-dd HH:mm"。
 */
export function formatShortTime(ts: number | string | Date): string {
    const d = ts instanceof Date ? ts : new Date(ts);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * 把毫秒时间戳格式化为 "yyyy-MM-dd"。
 */
export function formatDate(ts: number | string | Date): string {
    const d = ts instanceof Date ? ts : new Date(ts);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * 计算距今的"多久之前"友好字符串。
 */
export function timeAgo(ts: number | string | Date): string {
    const d = ts instanceof Date ? ts : new Date(ts);
    if (isNaN(d.getTime())) return '';
    const diff = Date.now() - d.getTime();
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return '刚刚';
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min} 分钟前`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} 小时前`;
    const day = Math.floor(hr / 24);
    if (day < 30) return `${day} 天前`;
    const mon = Math.floor(day / 30);
    if (mon < 12) return `${mon} 个月前`;
    const yr = Math.floor(day / 365);
    return `${yr} 年前`;
}

/**
 * 兼容旧 API（来自 frontend）的方法名。
 */
export function easyFormatTime(ts: number | string | Date | null | undefined): string {
    if (!ts) return '';
    return formatDateTime(ts);
}
