import { formatDate } from './time';

/**
 * 把时间相册接口返回的图片 URL 列表规范化为统一结构。
 */
export interface AlbumPhoto {
    id: string | number;
    url: string;
    date: string;
    comments?: AlbumComment[];
}

export interface AlbumComment {
    id: string | number;
    imageId: string | number;
    douyuID: string;
    createdAt: string;
    commentname: string;
}

export function normalizeAlbumPhoto(raw: any): AlbumPhoto {
    return {
        id: raw?.id ?? raw?.imageId ?? '',
        url: raw?.url ?? raw?.imageUrl ?? '',
        date: raw?.date ? formatDate(raw.date) : '',
        comments: Array.isArray(raw?.comments) ? raw.comments : [],
    };
}

export function normalizeAlbumComment(raw: any): AlbumComment {
    return {
        id: raw?.id ?? '',
        imageId: raw?.imageId ?? raw?.image_id ?? '',
        douyuID: raw?.douyuID ?? raw?.douyu_id ?? '',
        createdAt: raw?.createdAt ?? raw?.created_at ?? '',
        commentname: raw?.commentname ?? raw?.comment ?? '',
    };
}
