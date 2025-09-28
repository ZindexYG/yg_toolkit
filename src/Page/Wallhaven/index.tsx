import type { WallhavenStructure } from './types'
import React, { useEffect, useState } from 'react'
import { ImageGallery } from '@/Page/Wallhaven/components/image-gallery'
import wallhaven_structure from './wallhaven_structure.json'

export const Wallhaven: React.FC = () => {
  const [data, setData] = useState<WallhavenStructure | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, _setError] = useState<string | null>(null)

  // 加载JSON数据
  useEffect(() => {
    setData(wallhaven_structure as WallhavenStructure)
    setLoading(false)
    return () => {
    }
  }, [])

  // 加载状态
  if (loading)
    return <div className="p-4">加载中...</div>

  // 错误状态
  if (error)
    return <div className="p-4 text-red-500">{error}</div>

  // 无数据状态
  if (!data)
    return <div className="p-4">没有找到数据</div>

  // class="w-[calc(100%+2rem)]
  return (
    <div className="w-full h-full overflow-x-hidden ">
      {/* 渲染多个图片集，每个日期一组 */}
      <div className="flex flex-col gap-8 ">
        {data.directories.map((directory, index) => (
          <ImageGallery
            key={index}
            date={directory.date}
            images={directory.images}
          />
        ))}
      </div>
    </div>
  )
}

export default Wallhaven
