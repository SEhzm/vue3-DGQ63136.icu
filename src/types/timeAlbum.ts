/**
 * 时光相册相关类型，与后端 /dgq/showImage、/dgq/addCommentname 接口对齐。
 */
export interface AlbumImage {
    id: number;
    url: string;
    date: string;
    comments?: AlbumComment[];
}

export interface AlbumComment {
    id: number;
    imageId: number;
    douyuID: string;
    createdAt: string;
    commentname: string;
}

export interface AddCommentRequest {
    imageId: number | string;
    douyuID: string;
    commentname: string;
}

export interface UploadImageRequest {
    url: string;
    douyuID: string;
    description?: string;
}
