import type { CalendarSource } from './types'

const dopamine = [
  '#ff6b6b', // 鲜红
  '#ffb56b', // 橙黄
  '#ffd56b', // 明黄
  '#6bceff', // 亮蓝
  '#6bffb3', // 亮绿
  '#d56bff', // 亮紫
]

/**
 * 可用的日历数据源列表
 * - 中国法定节假日: 来自 NateScarlet/holiday-cn
 * - 二十四节气: 来自 KaitoHH/24-jieqi-ics
 */
export const CALENDAR_SOURCES: CalendarSource[] = [
  {
    id: 'chinese_statutory_holidays',
    label: '中国法定节假日',
    url: 'https://raw.githubusercontent.com/NateScarlet/holiday-cn/master/2025.ics',
    backgroundColor: dopamine[0],
  },
  {
    id: 'chinese_24_solar_terms',
    label: '中国二十四节气',
    url: 'https://raw.githubusercontent.com/KaitoHH/24-jieqi-ics/master/23_solar_terms_2015-01-01_2050-12-31.ics',
    backgroundColor: dopamine[1],
  },
]

/**
 * FullCalendar 默认配置
 */
export const DEFAULT_CALENDAR_OPTIONS = {
  locale: 'zh-cn',
  initialView: 'multiMonthYear',
  height: 'auto',
  headerToolbar: {
    right: 'multiMonthYear,dayGridMonth',
  },
} as const