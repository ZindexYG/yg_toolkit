import type { EventInput } from '@fullcalendar/core'

/**
 * 将 ICS 中的 DTSTART 字符串转换为 ISO 日期字符串
 * @param dateString - ICS 格式的日期字符串
 * @returns ISO 格式的日期字符串
 * @example
 * icsDateToIso('20250101') // '2025-01-01'
 * icsDateToIso('20250101T120000Z') // '2025-01-01T12:00:00Z'
 */
export function icsDateToIso(dateString: string): string {
  if (!dateString)
    return ''

  // 去掉可能的回车和空格
  const cleaned = dateString.trim().replace(/\r/g, '')

  // 处理纯日期格式 YYYYMMDD
  if (/^\d{8}$/.test(cleaned)) {
    const [, yyyy, mm, dd] = cleaned.match(/^(\d{4})(\d{2})(\d{2})$/) || []
    return `${yyyy}-${mm}-${dd}`
  }

  // 处理带时间的格式 YYYYMMDDTHHMMSS 或 YYYYMMDDTHHMMSSZ
  const timeMatch = cleaned.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/)
  if (timeMatch) {
    const [, yyyy, mm, dd, hh, mi, ss, z] = timeMatch
    // 如果有 Z 标记,表示 UTC 时间
    return z
      ? `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}Z`
      : `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`
  }

  // 其他格式直接返回
  return cleaned
}

/**
 * 解析 ICS 文本为 FullCalendar 事件数组
 * @param icsText - ICS 格式的文本内容
 * @returns FullCalendar 事件数组
 */
export function parseIcsToEvents(icsText: string): EventInput[] {
  if (!icsText)
    return []

  // 处理 ICS 折行(长行可能以空格或制表符折行)
  const unfoldedText = icsText.replace(/\r\n[ \t]/g, '')

  // 提取所有 VEVENT 块
  const vevents = unfoldedText.split(/BEGIN:VEVENT/).slice(1)

  return vevents
    .map(veventText => parseVEvent(veventText))
    .filter(Boolean) as EventInput[]
}

/**
 * 解析单个 VEVENT 块
 * @param veventText - VEVENT 文本内容
 * @returns FullCalendar 事件对象或 null
 */
function parseVEvent(veventText: string): EventInput | null {
  const endIdx = veventText.indexOf('END:VEVENT')
  const body = endIdx >= 0 ? veventText.slice(0, endIdx) : veventText

  /**
   * 从 VEVENT 文本中提取指定属性的值
   * @param propName - 属性名称
   * @returns 属性值
   */
  const getProperty = (propName: string): string => {
    const regex = new RegExp(`^${propName}(:|;[^:]*:)(.*)$`, 'im')
    const match = body.match(regex)
    return match ? match[2].trim() : ''
  }

  // 提取摘要和开始时间
  const summary = getProperty('SUMMARY') || '（无标题）'
  const dtstartRaw = getProperty('DTSTART') || getProperty('DTSTART;VALUE=DATE')

  if (!dtstartRaw)
    return null

  const isoDate = icsDateToIso(dtstartRaw)
  if (!isoDate)
    return null

  // 判断是否为全日事件(日期格式为 YYYY-MM-DD)
  const isAllDay = /^\d{4}-\d{2}-\d{2}$/.test(isoDate)

  return {
    title: summary,
    start: isoDate,
    allDay: isAllDay,
  }
}

/**
 * 验证 ICS 文本格式是否有效
 * @param icsText - ICS 文本内容
 * @returns 是否为有效的 ICS 格式
 */
export function isValidIcs(icsText: string): boolean {
  return /BEGIN:VCALENDAR/i.test(icsText)
}