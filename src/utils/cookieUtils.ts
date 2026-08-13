import Cookies from 'js-cookie';

const TokenKey = 'Admin-Token';
const RefreshTokenKey = 'Admin-Refresh-Token';
const TokenExpireKey = 'Admin-Token-Expire';
const tokenKeys = [TokenKey, RefreshTokenKey, TokenExpireKey];

function getStoredTokenValue(key: string) {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
}

function hasPersistentToken() {
    return tokenKeys.some((key) => localStorage.getItem(key));
}

function clearTokenStorage(storage: Storage) {
    tokenKeys.forEach((key) => storage.removeItem(key));
}

// 获取 token
export function getToken() {
    return getStoredTokenValue(TokenKey);
}

// 设置 token
export function setToken(token: string, refreshToken: string, expiresIn: number, persistent = hasPersistentToken()) {
    const expireTime = Date.now() + expiresIn * 1000;
    const targetStorage = persistent ? localStorage : sessionStorage;
    const unusedStorage = persistent ? sessionStorage : localStorage;

    clearTokenStorage(unusedStorage);
    targetStorage.setItem(TokenKey, token);
    targetStorage.setItem(RefreshTokenKey, refreshToken);
    targetStorage.setItem(TokenExpireKey, expireTime.toString());
}

// 获取刷新 token
export function getRefreshToken() {
    return getStoredTokenValue(RefreshTokenKey);
}

// 获取 token 过期时间
export function getTokenExpireTime() {
    const expireTime = getStoredTokenValue(TokenExpireKey);
    return expireTime ? parseInt(expireTime) : 0;
}

// 检查 token 是否即将过期（比如还有 5 分钟过期）
export function isTokenExpiringSoon() {
    const expireTime = getTokenExpireTime();
    const now = Date.now();
    // 如果还有 5 分钟过期，就返回 true
    return expireTime - now < 5 * 60 * 1000;
}

// 移除所有 token
export function removeToken() {
    clearTokenStorage(localStorage);
    clearTokenStorage(sessionStorage);

    // 重置登录状态
    try {
        // 动态导入以避免循环依赖
        import('@/apis/httpInstance').then(({ isRelogin }) => {
            isRelogin.value.show = false;
        });
    } catch (error) {
        console.warn('无法重置登录状态:', error);
    }
}

// 站点 token 相关（保持不变）
export function setSiteToken(token: string) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 365);
    return Cookies.set('siteToken', token, { expires });
}

export function getSiteToken() {
    return Cookies.get('siteToken');
}

// 保留 DGQ 原版的简易 cookie 读写 (用于向后兼容)
export function getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

export function setCookie(name: string, value: string, maxAgeMs?: number): void {
    let expires = '';
    if (maxAgeMs) {
        const date = new Date();
        date.setTime(date.getTime() + maxAgeMs);
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = `${name}=${encodeURIComponent(value || '')}${expires}; path=/; SameSite=Lax`;
}

export function deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
