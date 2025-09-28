// 图片信息接口
export interface ImageInfo {
  fullName: string;  // 完整文件名，例如 "wallhaven-2839em.jpg"
  simpleName: string;  // 简化文件名，例如 "2839em.jpg"
}

// 图片目录接口
export interface ImageDirectory {
  date: string;  // 日期，格式如 "20240205"
  images: ImageInfo[];  // 该日期下的图片集合
}

// 整体数据结构
export interface WallhavenStructure {
  directories: ImageDirectory[];
}