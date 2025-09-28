import type { ImageInfo } from '../types'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { FullImage } from './full-image'
import { SimpleImage } from './simple-image'

interface ImageGalleryProps {
  date: string // 图片集日期
  images: ImageInfo[] // 图片集合
  className?: string
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  date,
  images,
  className,
}) => {
  // 当前选中的图片文件名，用于显示大图
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // 格式化日期显示，例如从"20240205"转换为"2024年02月05日"
  const formattedDate = `${date.substring(0, 4)}年${date.substring(4, 6)}月${date.substring(6, 8)}日`

  return (
    <div className={cn('w-full', className)}>
      {/* 显示日期标题 */}
      <h2 className="mb-2 text-lg font-semibold">{formattedDate}</h2>

      {/* 横向滚动的图片容器 */}
      <div className="flex w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
        <div className="flex w-96 gap-4">
          {images.map((image, index) => (
            <SimpleImage
              key={index}
              fullName={image.fullName}
              simpleName={image.simpleName}
              onClick={() => setSelectedImage(image.fullName)}
              className="min-w-[200px] w-[200px] h-[120px]" // 固定尺寸以便横向排列
            />
          ))}
        </div>
      </div>

      {/* 全尺寸图片展示模态框 */}
      {selectedImage && (
        <FullImage
          fullName={selectedImage}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  )
}
