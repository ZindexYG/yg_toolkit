import type { EventInput } from '@fullcalendar/core'

/**
 * 日历数据源配置项
 */
export interface CalendarSource {
  /** 数据源唯一标识 */
  id: string
  /** 显示标签 */
  label: string
  /** ICS 文件 URL */
  url: string
  /** 事件背景颜色 */
  backgroundColor?: string
  /** 事件文字颜色 */
  textColor?: string
  /** 事件边框颜色 */
  borderColor?: string

}

/**
 * 带有来源标识的日历事件
 */
export interface EventWithSource extends EventInput {
  /** 事件来源 ID */
  _srcId?: string
}

/**
 * 日历数据源的加载状态
 */
export interface SourceLoadingState {
  /** 是否正在加载 */
  loading: Record<string, boolean>
  /** 错误信息 */
  error: Record<string, string | null>
}

/**
 * 数据源勾选状态
 */
export type CheckedState = Record<string, boolean>