"use client";

import { useState } from "react";

import type { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import FullCalendar from "@fullcalendar/react";
import { Flag, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { CALENDAR_SOURCES, DEFAULT_CALENDAR_OPTIONS } from "./_components/constants";
import type { CalendarSource, CheckedState } from "./_components/types";
import { useCalendarSources } from "./_components/use-calendar-sources";

const UNGROUPED_KEY = "__ungrouped__";

function groupSources(sources: CalendarSource[]) {
  const groups = new Map<string, { label: string | null; items: CalendarSource[] }>();
  for (const source of sources) {
    const key = source.group ?? UNGROUPED_KEY;
    if (!groups.has(key)) {
      groups.set(key, { label: source.group ?? null, items: [] });
    }
    groups.get(key)?.items.push(source);
  }
  return [...groups.values()];
}

function initialCheckedState(sources: CalendarSource[]): CheckedState {
  const currentYear = new Date().getFullYear();
  const defaultId = `chinese_statutory_holidays_${currentYear}`;
  return sources.reduce((acc, source) => {
    acc[source.id] = source.id === defaultId;
    return acc;
  }, {} as CheckedState);
}

export default function CalendarPage() {
  const [checked, setChecked] = useState<CheckedState>(() => initialCheckedState(CALENDAR_SOURCES));

  const { events, loadingState } = useCalendarSources(CALENDAR_SOURCES, checked);

  const groupedSources = groupSources(CALENDAR_SOURCES);

  const calendarOptions: CalendarOptions = {
    ...DEFAULT_CALENDAR_OPTIONS,
    plugins: [dayGridPlugin, multiMonthPlugin],
  };

  const toggleSource = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="container scrollbar-hide flex gap-3 p-6">
      <div className="control w-60">
        <Card className="pt-0">
          <CardHeader className="rounded-t-xl bg-muted/50 pt-3.5">
            <Flag width={16} height={16} />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {groupedSources.map((group, groupIndex) => (
                <div key={group.label ?? `group-${groupIndex}`} className="flex flex-col gap-1">
                  {group.label ? (
                    <div className="px-2 pb-1 text-xs font-medium text-muted-foreground">{group.label}</div>
                  ) : null}
                  {group.items.map((source) => {
                    const isChecked = !!checked[source.id];
                    const isLoading = !!loadingState.loading[source.id];
                    return (
                      <Label
                        key={source.id}
                        htmlFor={source.id}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 transition-colors hover:bg-accent"
                      >
                        <Checkbox id={source.id} checked={isChecked} onCheckedChange={() => toggleSource(source.id)} />
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: source.backgroundColor }}
                          aria-hidden
                        />
                        <span className="flex-1 text-sm">{source.label}</span>
                        {isLoading ? <Loader2 className="size-3 shrink-0 animate-spin text-muted-foreground" /> : null}
                      </Label>
                    );
                  })}
                </div>
              ))}
              <div className="mt-1">
                {Object.entries(loadingState.error).map(([id, msg]) =>
                  msg ? (
                    <div key={id} className="text-xs text-red-600">
                      {CALENDAR_SOURCES.find((s) => s.id === id)?.label} 加载失败：{msg}
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 rounded-xl bg-white p-4 shadow">
        <FullCalendar {...calendarOptions} events={events} />
      </div>
    </div>
  );
}
