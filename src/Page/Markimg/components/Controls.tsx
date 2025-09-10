import { CloudUpload } from 'lucide-react'
import { useContext, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MarkimgContext } from '../index'

function Controls() {
  // 定义表单字段类型
  interface FormValues {
    imageFile: File | null
    text: string
    color: string
    alpha: number
    angle: number
    space: number
    size: number
    format: 'png' | 'jpeg' | string
  }

  // 初始化表单默认值
  const form = useForm<FormValues>({
    defaultValues: {
      imageFile: null,
      text: '',
      color: '#FFF',
      alpha: 0.1,
      angle: 50,
      space: 3,
      size: 1,
      format: 'png',
    },
  })

  const { register, setValue } = form
  const watchedValues = useWatch<FormValues>({ control: form.control })

  // 获取父级提供的 setControls，用于将本组件的 form 信息注册到父级
  const markimgCtx = useContext(MarkimgContext)

  // 当表单任何值变化时执行（这里示例为打印，可替换为上层回调或其它逻辑）
  useEffect(() => {
    // 监听表单变化，watchedValues 包含当前所有字段的最新值
    // console.log('表单值变化', watchedValues)
    // 如果父级传入了 setControls，则同步当前 form 信息与值到父级
    if (markimgCtx?.setControls) {
      markimgCtx.setControls({
        form,
        watchedValues,
      })
    }
  }, [watchedValues])

  return (
    <Card className="h-full">
      <Form {...form}>
        <form>
          <CardHeader className="font-medium">选择本地图片</CardHeader>
          <CardContent className="relative">

            <Input
              {...register('imageFile')}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              placeholder="图片地址"
              type="file"
              accept="image/png,image/jpeg,image/gif"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0] ?? null
                setValue('imageFile', file)
              }}
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
              <CloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">点击选择设备中的图片</p>
              <p className="text-gray-400 text-sm mt-1">支持 PNG、JPG、GIF - 本地处理</p>
            </div>
          </CardContent>
          <CardHeader className="font-medium">水印文字</CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {/* 水印文字 */}

            <Input className="col-span-2" type="text" placeholder="水印文字" {...register('text')} />
            {/* 颜色选择 */}
            <div className="flex flex-wrap gap-3">
              <div>水印颜色</div>
              <Input defaultValue={watchedValues?.color} type="color" {...register('color')} />
            </div>
            {/* 不同参数（范围）绑定到表单字段 */}
            <div className="flex flex-wrap gap-3">
              <div>透明度</div>
              <Input
                type="range"
                min="0"
                max="1"
                step="0.05"
                {...register('alpha')}
              />

            </div>
            <div className="flex flex-wrap gap-3">
              <div>角度</div>
              <Input
                type="range"
                min="-90"
                max="90"
                step="3"
                {...register('angle')}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <div>间距</div>
              <Input
                type="range"
                min="1"
                max="8"
                step="0.2"
                {...register('space')}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <div>字体大小</div>
              <Input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                {...register('size')}
              />
            </div>
            {/* 额外保留一个隐藏 input 以确保字段在表单值中存在 */}
            <input type="hidden" {...register('format')} />
            <div className="flex flex-wrap gap-3">
              <div>导出格式</div>
              <Select
                onValueChange={(value: string) => {
                  setValue('format', value)
                }}
                value={watchedValues?.format}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

          </CardContent>

          {/* <CardHeader>预览和下载</CardHeader>
        <CardContent></CardContent> */}

        </form>
      </Form>
    </Card>
  )
}

export default Controls
