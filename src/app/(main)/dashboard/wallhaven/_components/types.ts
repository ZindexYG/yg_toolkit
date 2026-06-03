export interface ImageInfo {
  fullName: string;
  simpleName: string;
}

export interface ImageDirectory {
  date: string;
  images: ImageInfo[];
}

export interface WallhavenStructure {
  directories: ImageDirectory[];
}
