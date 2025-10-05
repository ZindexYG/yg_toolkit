import type { EventInput } from '@fullcalendar/core'
import type { CalendarSource, CheckedState, EventWithSource, SourceLoadingState } from './types'
import { useEffect, useState } from 'react'
import { isValidIcs, parseIcsToEvents } from './utils/icsParser'

/**
 * 自定义 Hook: 管理日历数据源的加载和状态
 * @param sources - 数据源配置数组(包含颜色信息)
 * @param checkedState - 当前勾选状态
 * @returns 日历事件列表和加载状态
 */
export function useCalendarSources(
  sources: CalendarSource[],
  checkedState: CheckedState,
) {
  // 合并后的所有事件
  const [events, setEvents] = useState<EventInput[]>([])

  // 各数据源的加载状态
  const [loadingState, setLoadingState] = useState<SourceLoadingState>({
    loading: {},
    error: {},
  })

  /**
   * 根据数据源 ID 查找对应的配置
   * @param sourceId - 数据源 ID
   * @returns 数据源配置对象
   */
  const findSourceById = (sourceId: string): CalendarSource | undefined => {
    return sources.find(s => s.id === sourceId)
  }

  /**
   * 从指定数据源获取并解析 ICS 数据
   * @param source - 数据源配置
   * @returns 解析后的事件列表(带颜色信息)
   */
  const fetchIcsSource = async (source: CalendarSource): Promise<EventInput[]> => {
    if (!source.url) {
      throw new Error('未配置数据源 URL')
    }

    const response = await fetch(source.url)

    if (!response.ok) {
      throw new Error(`请求失败：${response.status} ${response.statusText}`)
    }

    const text = await response.text()

    // 验证 ICS 格式
    if (!isValidIcs(text)) {
      throw new Error('返回内容不是有效的 ICS 格式')
    }

    const parsedEvents = parseIcsToEvents(text)

    // 为事件添加来源标识和颜色信息
    return parsedEvents.map((event: any) => ({
      ...event,
      _srcId: source.id,
      // 添加颜色属性
      backgroundColor: source.backgroundColor,
      textColor: source.textColor,
      borderColor: source.borderColor || source.backgroundColor,
    }))
  }

  /**
   * 更新指定数据源的加载状态
   */
  const updateLoadingState = (
    sourceId: string,
    loading: boolean,
    error: string | null = null,
  ) => {
    setLoadingState(prev => ({
      loading: { ...prev.loading, [sourceId]: loading },
      error: { ...prev.error, [sourceId]: error },
    }))
  }

  /**
   * 加载单个数据源
   */
  const loadSource = async (sourceId: string) => {
    // 如果正在加载则跳过
    if (loadingState.loading[sourceId]) {
      return
    }

    // 查找数据源配置
    const source = findSourceById(sourceId)
    if (!source) {
      updateLoadingState(sourceId, false, '未找到数据源配置')
      return
    }

    updateLoadingState(sourceId, true, null)

    try {
      // 使用完整的 source 对象调用 fetchIcsSource
      const eventsWithColor = await fetchIcsSource(source)

      // 更新事件列表：移除旧的同源事件,添加新事件
      setEvents(prev => {
        const filtered = prev.filter(
          event => (event as EventWithSource)._srcId !== sourceId,
        )
        return [...filtered, ...eventsWithColor]
      })

      updateLoadingState(sourceId, false, null)
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      updateLoadingState(sourceId, false, errorMessage)
    }
  }

  /**
   * 移除指定数据源的所有事件
   */
  const removeSourceEvents = (sourceId: string) => {
    setEvents(prev =>
      prev.filter(event => (event as EventWithSource)._srcId !== sourceId),
    )
  }

  // 监听勾选状态变化,加载或移除对应数据源
  useEffect(() => {
    // 获取被勾选的数据源
    const selectedIds = Object.keys(checkedState).filter(id => checkedState[id])

    // 获取未勾选的数据源
    const unselectedIds = Object.keys(checkedState).filter(id => !checkedState[id])

    // 加载被勾选的数据源
    selectedIds.forEach(id => {
      loadSource(id)
    })

    // 移除未勾选数据源的事件
    unselectedIds.forEach(id => {
      removeSourceEvents(id)
    })
  }, [checkedState])

  return {
    events,
    loadingState,
  }
}