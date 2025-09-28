import React from 'react'
import { cn } from '@/lib/utils'

interface SimpleImageProps {
  fullName: string // 完整文件名，用于提取图片ID
  simpleName: string // 简化文件名，用于alt描述
  onClick?: () => void // 点击事件处理函数
  className?: string
}

export const SimpleImage: React.FC<SimpleImageProps> = ({
  fullName,
  simpleName,
  onClick,
  className,
}) => {
  // 从fullName中提取ID部分（去掉"wallhaven-"前缀和".jpg"后缀）
  const id = fullName.replace('wallhaven-', '').replace('.jpg', '')

  // 提取ID的前两个字符作为URL路径部分
  const pathPart = id.substring(0, 2).toLowerCase()

  // 构建缩略图URL
  const thumbnailUrl = `https://th.wallhaven.cc/small/${pathPart}/${id}.jpg`

  return (
    <div
      className={cn(
        'cursor-pointer overflow-hidden rounded-md transition-all hover:opacity-80',
        className,
      )}
      onClick={onClick}
    >
      <img
        src={thumbnailUrl}
        alt={`缩略图 ${simpleName}`}
        className="h-auto w-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
