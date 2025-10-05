import type { CalendarOptions } from '@fullcalendar/core'
import type { CheckedState } from './types'
import dayGridPlugin from '@fullcalendar/daygrid'
import multiMonthPlugin from '@fullcalendar/multimonth'
import FullCalendar from '@fullcalendar/react'
import { Flag } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CALENDAR_SOURCES, DEFAULT_CALENDAR_OPTIONS } from './constants'
import { useCalendarSources } from './useCalendarSources'

/**
 * 日历组件 - 支持多数据源切换显示
 *
 * 功能:
 * - 支持中国法定节假日显示
 * - 支持二十四节气显示
 * - 支持多数据源同时显示
 * - 支持月视图和年视图切换
 */
function Calendar() {
  // 初始化勾选状态 - 默认全部未勾选
  const [checked, setChecked] = useState<CheckedState>(() =>
    CALENDAR_SOURCES.reduce((acc, source) => {
      acc[source.id] = false
      return acc
    }, {} as CheckedState),
  )

  // 使用自定义 Hook 管理数据源加载
  const { events, loadingState } = useCalendarSources(CALENDAR_SOURCES, checked)

  // FullCalendar 配置
  const calendarOptions: CalendarOptions = {
    ...DEFAULT_CALENDAR_OPTIONS,
    plugins: [dayGridPlugin, multiMonthPlugin],
  }

  /**
   * 切换数据源勾选状态
   * @param id - 数据源 ID
   */
  const toggleSource = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="container scrollbar-hide p-6 flex gap-3">
      {/* 左侧控制面板 */}
      <div className="control w-60">
        <Card className="pt-0">
          <CardHeader className="bg-muted/50 pt-3.5 rounded-t-xl">
            <Flag width={16} height={16} />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {/* 数据源勾选列表 */}
              {CALENDAR_SOURCES.map(source => (
                <div className="flex items-center gap-3" key={source.id}>
                  <Checkbox
                    id={source.id}
                    checked={checked[source.id]}
                    onCheckedChange={() => toggleSource(source.id)}
                  />
                  <Label htmlFor={source.id} className="flex-1">
                    {source.label}
                  </Label>
                  {/* 加载状态提示 */}
                  {loadingState.loading[source.id] && (
                    <span className="text-xs text-muted-foreground">
                      加载中…
                    </span>
                  )}
                </div>
              ))}

              {/* 错误信息显示 */}
              <div className="mt-3">
                {Object.entries(loadingState.error).map(([id, msg]) =>
                  msg
                    ? (
                        <div key={id} className="text-sm text-red-600">
                          {CALENDAR_SOURCES.find(s => s.id === id)?.label}
                          {' '}
                          加载失败：
                          {msg}
                        </div>
                      )
                    : null,
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 右侧日历显示区域 */}
      <div className="flex-1 bg-white rounded-xl p-4 shadow">
        <FullCalendar {...calendarOptions} events={events} />
      </div>
    </div>
  )
}

export default Calendar
