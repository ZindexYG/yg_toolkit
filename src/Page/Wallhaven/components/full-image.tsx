import { X } from 'lucide-react' // 使用lucide-react图标
import React from 'react'

interface FullImageProps {
  fullName: string // 完整文件名
  isOpen: boolean // 是否显示
  onClose: () => void // 关闭处理函数
}

export const FullImage: React.FC<FullImageProps> = ({
  fullName,
  isOpen,
  onClose,
}) => {
  // 如果不是打开状态则不渲染
  if (!isOpen)
    return null

  // 从fullName中提取ID
  const id = fullName.replace('wallhaven-', '').replace('.jpg', '')

  // 提取ID的前两个字符作为路径部分
  const pathPart = id.substring(0, 2).toLowerCase()

  // 构建全尺寸图片URL
  const fullImageUrl = `https://w.wallhaven.cc/full/${pathPart}/${fullName}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={fullImageUrl}
          alt={`${fullName}`}
          className="h-auto max-h-[90vh] w-auto max-w-[90vw] object-contain"
        />
        <button
          className="absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/80"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
