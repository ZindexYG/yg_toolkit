import { ChevronDownIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const LocaleDateOption = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
} as const

function unix({ now }: { now: Date | null }) {
  // 时间单位
  const [timeUnit, setTimeUnit] = useState<'seconds' | 'milliseconds'>('seconds')
  // 获取当前时间戳
  const [_timestamp, setTimestamp] = useState<number | null>(null)
  // 输入的时间戳
  const [inputTimestamp, setInputTimestamp] = useState('')

  // 输出的日期时间
  const [outputDateTime, setOutputDateTime] = useState<string>('')

  const [open, setOpen] = useState(false) // 控制 Popover 打开关闭

  const [dateString, setDateString] = useState<string>('') // 日期字符串
  const [timeString, setTimeString] = useState<string>('00:00:00') // 时间字符串

  const [outputTimestamp, setOutputTimestamp] = useState<string>('') // 输出的时间戳

  // 获取当前时间戳
  const getCurrentTimestamp = () => {
    if (!now)
      return
    // setTimestamp(Math.floor(new Date().getTime() / 1000))
    const currentTime = now.getTime()
    // 将数字转换为字符串以匹配 inputTimestamp 的类型（string）
    // 避免直接传入 number 导致 TypeScript 错误
    setInputTimestamp(String(timeUnit === 'seconds' ? Math.floor(currentTime / 1000) : currentTime))
  }

  // 时间戳转日期时间
  const convertTimestampToDate = () => {
    if (!inputTimestamp) {
      // alert('请输入时间戳')
      return
    }
    const ts = Number(inputTimestamp)
    if (Number.isNaN(ts)) {
      // alert('请输入有效的数字时间戳')
      return
    }
    // 根据选择的时间单位进行转换
    const date = timeUnit === 'seconds' ? new Date(ts * 1000) : new Date(ts)

    const options = Object.assign({}, LocaleDateOption, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    } as const)

    // 格式化日期时间输出
    const formattedDate = timeUnit === 'seconds' ? date.toLocaleDateString(undefined, options) : `${date.toLocaleDateString(undefined, options)} ${date.getMilliseconds()}`
    setOutputDateTime(formattedDate)
  }

  // reset
  const reset = () => {
    setInputTimestamp('')
    setOutputDateTime('')
    setTimestamp(null)
  }

  //
  useEffect(() => {
    reset()
  }, [timeUnit])

  // 获取当前时间
  const getCurrentDateTime = () => {
    if (!now)
      return
    const options = Object.assign({}, LocaleDateOption, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    } as const)
    const formattedDate = now.toLocaleDateString(undefined, options)
    setDateString(now.toLocaleDateString(undefined, LocaleDateOption))
    // setTimeString(now.toTimeString())
    setTimeString(formattedDate.split(' ')[1])
  }

  // 日期时间转时间戳
  const convertDateToTimestamp = () => {
    // debugger
    if (!dateString || !timeString) {
      // alert('请输入完整的日期和时间')
      return
    }
    const date = new Date(`${dateString} ${timeString}`)
    const timestamp = Math.floor(date.getTime() / 1000)
    setOutputTimestamp(String(timestamp))
  }

  return (
    <div className="p-4 space-y-4">
      {/* 时间戳转日期时间 */}
      <h3 className="flex justify-baseline items-center gap-2">
        <span className="text-md">时间戳转日期时间</span>
        <Select
          defaultValue="seconds"
          onValueChange={(value) => {
            setTimeUnit(value as 'seconds' | 'milliseconds')
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="选择时间单位" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seconds">秒 (10位)</SelectItem>
            <SelectItem value="milliseconds">毫秒 (13位)</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={getCurrentTimestamp}>获取当前时间戳</Button>
      </h3>

      <div className="flex gap-2">
        <Input
          type="number"
          value={inputTimestamp}
          onChange={e => setInputTimestamp(e.target.value)}
          placeholder="请输入时间戳"
        />
        <Button variant="outline" onClick={convertTimestampToDate}>转换</Button>
        <Input value={outputDateTime} readOnly />
      </div>

      {/* ---- */}

      <h3 className="flex justify-baseline items-center gap-2">
        <span className="text-md">日期时间转时间戳</span>
        <Button variant="outline" onClick={getCurrentDateTime}>获取当前时间</Button>
      </h3>

      {/* 日期时间转时间戳 */}
      <div className="flex gap-2">
        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker"
                className="justify-between font-normal"
              >
                {dateString || 'Select date'}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={dateString ? new Date(dateString) : undefined}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (!date)
                    return
                  setDateString(date.toLocaleDateString(undefined, LocaleDateOption))
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            step="1"
            defaultValue="00:00:00"
            value={timeString}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            onChange={(e) => {
              // console.log('time', e.target.value)
              setTimeString(e.target.value)
            }}
          />
        </div>

        <Button variant="outline" onClick={convertDateToTimestamp}>转换</Button>
        <Input value={outputTimestamp} readOnly />
      </div>

    </div>
  )
}

export default unix
