import { Download, Link, ScanSearch } from 'lucide-react'
import React, { useState } from 'react'
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
  const [isDownloading, setIsDownloading] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // 从fullName中提取ID部分（去掉"wallhaven-"前缀和".jpg"后缀）
  const id = fullName.replace('wallhaven-', '').replace('.jpg', '')
  // 提取ID的前两个字符作为URL路径部分
  const pathPart = simpleName.substring(0, 2).toLowerCase()
  // 构建缩略图URL
  const thumbnailUrl = `https://th.wallhaven.cc/small/${pathPart}/${simpleName}`

  const pageUrl = `https://wallhaven.cc/w/${id}`

  // https://w.wallhaven.cc/full/5g/wallhaven-5gjz33.png
  const fullUrl = `https://w.wallhaven.cc/full/${pathPart}/${fullName}`
  // https://w.wallhaven.cc/full/5g/wallhaven-5gjz33.png

  const handleDowload = async (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (isDownloading)
      return
    setIsDownloading(true)
    try {
      const response = await fetch(fullUrl)

      if (!response.ok) {
        throw new Error(`下载失败: ${response.status} ${response.statusText}`)
      }

      // 转换为blob
      const blob = await response.blob()

      // 创建blob URL
      const blobUrl = URL.createObjectURL(blob)

      // 创建下载链接并点击
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = fullName
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()

      // 清理
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
    }
    catch (error) {
      console.error('下载图片失败:', error)
    }
    finally {
      // 添加小延迟，让用户感知到下载动作
      setTimeout(() => {
        setIsDownloading(false)
      }, 800)
    }
  }

  return (
    <div
      className={cn(
        'relative cursor-pointer overflow-hidden rounded-md',
        className,
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img
        src={thumbnailUrl}
        alt={`${fullName}`}
        className="h-auto w-full object-cover"
        loading="lazy"
      />
      <div className={cn(
        'absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200',
        isHovering ? 'opacity-100' : 'opacity-0',
      )}
      >
        <div className="flex space-x-4">
          <ScanSearch
            className="text-white h-5 w-5 hover:scale-110 transition-transform cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              onClick && onClick()
            }}
          />

          <Link
            className="text-white h-5 w-5 hover:scale-110 transition-transform cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              window.open(pageUrl, '_blank')
            }}
          />

          <Download
            className={cn(
              'text-white h-5 w-5 hover:scale-110 transition-transform cursor-pointer',
              isDownloading && 'animate-pulse',
            )}
            onClick={handleDowload}
          />
        </div>
      </div>

    </div>
  )
}
