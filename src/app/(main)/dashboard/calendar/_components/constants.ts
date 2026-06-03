import type { CalendarSource } from "./types";

const dopamine = ["#ff6b6b", "#ffb56b", "#ffd56b", "#6bceff", "#6bffb3", "#d56bff"];

export const CALENDAR_SOURCES: CalendarSource[] = [
  {
    id: "chinese_statutory_holidays",
    label: "中国法定节假日",
    url: "https://raw.githubusercontent.com/NateScarlet/holiday-cn/master/2025.ics",
    backgroundColor: dopamine[0],
  },
  {
    id: "chinese_24_solar_terms",
    label: "中国二十四节气",
    url: "https://raw.githubusercontent.com/KaitoHH/24-jieqi-ics/master/23_solar_terms_2015-01-01_2050-12-31.ics",
    backgroundColor: dopamine[1],
  },
];

export const DEFAULT_CALENDAR_OPTIONS = {
  locale: "zh-cn",
  initialView: "multiMonthYear",
  height: "auto",
  headerToolbar: {
    right: "multiMonthYear,dayGridMonth",
  },
} as const;
