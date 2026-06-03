"use client";

import { useEffect, useState } from "react";

import type { EventInput } from "@fullcalendar/core";

import type { CalendarSource, CheckedState, EventWithSource, SourceLoadingState } from "./types";
import { isValidIcs, parseIcsToEvents } from "./utils/ics-parser";

export function useCalendarSources(sources: CalendarSource[], checkedState: CheckedState) {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [loadingState, setLoadingState] = useState<SourceLoadingState>({
    loading: {},
    error: {},
  });

  const findSourceById = (sourceId: string): CalendarSource | undefined => sources.find((s) => s.id === sourceId);

  const fetchIcsSource = async (source: CalendarSource): Promise<EventInput[]> => {
    if (!source.url) throw new Error("未配置数据源 URL");
    const response = await fetch(source.url);
    if (!response.ok) throw new Error(`请求失败：${response.status} ${response.statusText}`);
    const text = await response.text();
    if (!isValidIcs(text)) throw new Error("返回内容不是有效的 ICS 格式");
    const parsedEvents = parseIcsToEvents(text);
    return parsedEvents.map((event) => ({
      ...event,
      _srcId: source.id,
      backgroundColor: source.backgroundColor,
      textColor: source.textColor,
      borderColor: source.borderColor || source.backgroundColor,
    }));
  };

  const updateLoadingState = (sourceId: string, loading: boolean, error: string | null = null) => {
    setLoadingState((prev) => ({
      loading: { ...prev.loading, [sourceId]: loading },
      error: { ...prev.error, [sourceId]: error },
    }));
  };

  const loadSource = async (sourceId: string) => {
    if (loadingState.loading[sourceId]) return;
    const source = findSourceById(sourceId);
    if (!source) {
      updateLoadingState(sourceId, false, "未找到数据源配置");
      return;
    }
    updateLoadingState(sourceId, true, null);
    try {
      const eventsWithColor = await fetchIcsSource(source);
      setEvents((prev) => {
        const filtered = prev.filter((e) => (e as EventWithSource)._srcId !== sourceId);
        return [...filtered, ...eventsWithColor];
      });
      updateLoadingState(sourceId, false, null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      updateLoadingState(sourceId, false, errorMessage);
    }
  };

  const removeSourceEvents = (sourceId: string) => {
    setEvents((prev) => prev.filter((e) => (e as EventWithSource)._srcId !== sourceId));
  };

  useEffect(() => {
    const selectedIds = Object.keys(checkedState).filter((id) => checkedState[id]);
    const unselectedIds = Object.keys(checkedState).filter((id) => !checkedState[id]);
    selectedIds.forEach((id) => loadSource(id));
    unselectedIds.forEach((id) => removeSourceEvents(id));
  }, [checkedState]);

  return { events, loadingState };
}
