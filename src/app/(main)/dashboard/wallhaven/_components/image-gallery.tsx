"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { FullImage } from "./full-image";
import { SimpleImage } from "./simple-image";
import type { ImageInfo } from "./types";

interface ImageGalleryProps {
  date: string;
  images: ImageInfo[];
  className?: string;
}

export function ImageGallery({ date, images, className }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formattedDate = `${date.substring(0, 4)}年${date.substring(4, 6)}月${date.substring(6, 8)}日`;

  return (
    <div className={cn("w-full", className)}>
      <h2 className="mb-2 text-lg font-semibold">{formattedDate}</h2>
      <div className="m-auto max-w-[calc(100%_-_var(--sidebar-width))]">
        <div className="flex flex-wrap gap-4">
          {images.map((image, index) => (
            <SimpleImage
              key={index}
              fullName={image.fullName}
              simpleName={image.simpleName}
              onClick={() => setSelectedImage(image.fullName)}
              className="h-[120px] w-[200px] min-w-[200px]"
            />
          ))}
        </div>
      </div>
      {selectedImage && (
        <FullImage fullName={selectedImage} isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
}
