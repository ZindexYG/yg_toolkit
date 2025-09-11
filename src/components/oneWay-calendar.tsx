import { useEffect, useState } from 'react'

interface Props {
  year: string
  time: string
  alt?: string
}

/**
 * 构造图片地址（纯函数）
 */
function buildImageUrl(year: string, time: string) {
  return `https://img.owspace.com/Public/uploads/Download/${year}/${time}.jpg`
}

/**
 * OneWayCalendar 组件
 */
export function OneWayCalendar({ year, time, alt = 'calendar' }: Props) {
  const [src, setSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    let objectUrl: string | null = null

    async function load() {
      setLoading(true)
      setError(null)

      const url = buildImageUrl(year, time)

      try {
        const resp = await fetch(url, { referrer: '' })
        if (!resp.ok) {
          throw new Error(`请求失败，状态码 ${resp.status}`)
        }
        const blob = await resp.blob()
        objectUrl = URL.createObjectURL(blob)
        if (mounted) {
          setSrc(objectUrl)
        }
      }
      catch (err: any) {
        if (mounted) {
          setError(err?.message ?? '加载失败')
        }
      }
      finally {
        if (mounted)
          setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [year, time])

  if (loading)
    return <div>加载中...</div>
  if (error) {
    return (
      <div>
        加载失败：
        {error}
      </div>
    )
  }
  if (!src)
    return <div>未获取到图片</div>

  return <img src={src} alt={alt} style={{ maxWidth: '100%', height: 'auto' }} />
}

export default OneWayCalendar
