import { ChevronDownIcon } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const LocaleDateOption = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
} as const

function iso8601({ now }: { now: Date }) {
  // 输入的 iso 8601 字符串
  const [inputISO8601, setInputISO8601] = useState('')

  // 输出的日期时间
  const [outputDateTime, setOutputDateTime] = useState<string>('')

  const [open, setOpen] = useState(false) // 控制 Popover 打开关闭

  const [dateString, setDateString] = useState<string>('') // 日期字符串
  const [timeString, setTimeString] = useState<string>('00:00:00') // 时间字符串

  const [outputISO8601, setOutputISO8601] = useState<string>('') // 输出的 iso 8601 字符串

  // 获取当前 iso 8601 字符串
  const getCurrentTimestamp = () => {
    // setTimestamp(Math.floor(new Date().getTime() / 1000))
    const currentTime = now.toISOString()
    // 将数字转换为字符串以匹配 inputTimestamp 的类型（string）
    // 避免直接传入 number 导致 TypeScript 错误
    setInputISO8601(currentTime)
  }

  // 获取当前日期时间
  const getCurrentDateTime = () => {
    if (!now)
      return

    const currentDate = now.toLocaleDateString(undefined, LocaleDateOption)
    const currentTime = now.toTimeString().split(' ')[0]
    setDateString(currentDate)
    setTimeString(currentTime)
  }

  // iso 8601 转日期时间
  const convertISO8601ToDate = () => {
    const date = new Date(inputISO8601)
    setOutputDateTime(date.toLocaleString())
  }

  // 日期时间转 iso 8601
  const convertDateToISO = () => {
    if (!dateString || !timeString) {
      // alert('请选择日期')
      return
    }
    const dateTimeString = `${dateString} ${timeString}`
    const date = new Date(dateTimeString)
    setOutputISO8601(date.toISOString())
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="flex justify-baseline items-center gap-2">
        <span className="text-md">ISO 8601 转日期时间</span>
        <Button variant="outline" onClick={getCurrentTimestamp}>获取当前时间戳</Button>
      </h3>
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputISO8601}
          onChange={e => setInputISO8601(e.target.value)}
          placeholder="请输入 ISO 8601 字符串"
        />
        <Button
          variant="outline"
          onClick={convertISO8601ToDate}
        >
          转换
        </Button>
        <Input value={outputDateTime} readOnly />
      </div>

      <h3 className="flex justify-baseline items-center gap-2">
        <span className="text-md">日期时间转 ISO 8601</span>
        <Button variant="outline" onClick={getCurrentDateTime}>获取当前时间</Button>
      </h3>
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
              setTimeString(e.target.value)
            }}
          />
        </div>
        <Button variant="outline" onClick={convertDateToISO}>转换</Button>
        <Input value={outputISO8601} readOnly />
      </div>
    </div>
  )
}

export default iso8601
