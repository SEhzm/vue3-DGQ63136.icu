/**
 * 把后台给的标签字符串转换成真正显示的标签信息。
 */
export interface DisplayTag {
    label: string;
    dictValue: string;
    iconUrl: string;
}

export function getDisplayTags(tagNums: string | undefined, memeTags: any[]): DisplayTag[] {
    if (!tagNums) return [];
    const tagsArr = tagNums.split(',').map((s) => s.trim()).filter(Boolean);
    if (!Array.isArray(memeTags)) return [];
    return memeTags
        .filter((item) => tagsArr.includes(String(item.dictValue)))
        .map((item) => ({ label: item.dictLabel, dictValue: item.dictValue, iconUrl: item.iconUrl || '' }));
}
