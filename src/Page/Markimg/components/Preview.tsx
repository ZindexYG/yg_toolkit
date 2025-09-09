import { ImageIcon } from 'lucide-react'
import { useContext, useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MarkimgContext } from '../index'

function Preview() {
  const ctx = useContext(MarkimgContext)
  const watched = ctx?.controls?.watchedValues

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 将 Data URI 转换为 Blob 对象
  const dataURItoBlob = (dataURI: string) => {
    const arr = dataURI.split(',')
    const mimeType = arr[0].match(/:(.*?);/)![1]
    const binStr = atob(arr[1])
    const len = binStr.length
    const uintArr = new Uint8Array(len)

    for (let i = 0; i < len; i++) {
      uintArr[i] = binStr.charCodeAt(i)
    }

    return new Blob([uintArr], { type: mimeType })
  }

  // 生成文件名
  const generateFileName = (format: string = 'png') => {
    const pad = (n: number) => n < 10 ? `0${n}` : n.toString()
    const extension = format === 'jpeg' ? '.jpg' : '.png'
    const d = new Date()

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}${extension}`
  }

  // 读取图片文件并创建 Canvas
  const processImage = (file: File) => {
    if (!file || !(file instanceof File))
      return

    const fileReader = new FileReader()
    fileReader.onload = () => {
      const img = new Image()
      img.onload = () => {
        if (!canvasRef.current)
          return

        const canvas = canvasRef.current
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext('2d')
        if (!ctx)
          return

        ctx.drawImage(img, 0, 0)
        setCanvas(canvas)
        setImage(img)
      }
      img.src = fileReader.result as string
    }
    fileReader.readAsDataURL(file)
  }

  // 绘制水印文字
  const drawWatermark = () => {
    if (!canvas || !image || !watched)
      return

    const { text, color, alpha, angle, size, space } = watched
    if (!text || !color)
      return

    const ctx = canvas.getContext('2d')
    if (!ctx)
      return

    // 清除画布并重新绘制图片
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0)

    // 解析颜色值
    const colorMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
    if (!colorMatch)
      return

    const rgba = `rgba(${Number.parseInt(colorMatch[1], 16)},${Number.parseInt(colorMatch[2], 16)},${Number.parseInt(colorMatch[3], 16)},${alpha || 0.5})`

    // 计算文字大小
    const textSize = (size || 1) * Math.max(15, (Math.min(canvas.width, canvas.height)) / 25)

    // 设置文字样式
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((angle || 0) * Math.PI / 180)
    ctx.fillStyle = rgba
    ctx.font = `bold ${textSize}px -apple-system,"Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","WenQuanYi Micro Hei",sans-serif`

    // 计算文字尺寸和分布
    const width = ctx.measureText(text).width
    const step = Math.sqrt(canvas.width ** 2 + canvas.height ** 2)
    const margin = ctx.measureText('-').width
    // const space = watched.size || 2

    // 计算需要绘制的行列数
    const x = Math.ceil(step / (width + margin))
    const y = Math.ceil((step / (space * textSize)) / 2)

    // 绘制水印文字
    for (let i = -x; i <= x; i++) {
      for (let j = -y; j <= y; j++) {
        ctx.fillText(text, (width + margin) * i, space * textSize * j)
      }
    }

    ctx.restore()
  }

  // 处理下载功能
  const handleDownload = () => {
    if (!canvas || !watched)
      return

    const format = watched.format || 'png'
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png'
    const quality = format === 'jpeg' ? 0.9 : undefined

    const imageData = quality !== undefined
      ? canvas.toDataURL(mimeType, quality)
      : canvas.toDataURL(mimeType)

    const blob = dataURItoBlob(imageData)
    const link = document.createElement('a')
    link.download = generateFileName(format)
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }

  // 监听图片文件变化
  useEffect(() => {
    if (watched?.imageFile && watched.imageFile instanceof File) {
      processImage(watched.imageFile)
    }
  }, [watched?.imageFile])

  // 监听水印参数变化，重新绘制水印
  useEffect(() => {
    if (canvas && image && watched) {
      drawWatermark()
    }
  }, [canvas, image, watched?.text, watched?.color, watched?.alpha, watched?.size, watched?.angle, watched?.space, watched?.format])

  return (
    <Card className="h-full">
      <CardHeader className="mb-2 font-medium">预览</CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="min-h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
          onClick={handleDownload}
        >
          {/* 始终渲染 canvas，但在没有图片时隐藏 */}
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              display: image ? 'block' : 'none',
            }}
          />

          {!image && (
            <div className="text-center text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">选择图片进行预览</p>
              <p className="text-sm mt-1">添加水印的图片将在此显示</p>
            </div>
          )}
        </div>
        <div className="text-center text-gray-500 text-sm mt-4">点击带水印的图片即可下载</div>
      </CardContent>
    </Card>
  )
}

export default Preview
