"use client";

import { useState } from "react";

import type { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import FullCalendar from "@fullcalendar/react";
import { Flag } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { CALENDAR_SOURCES, DEFAULT_CALENDAR_OPTIONS } from "./_components/constants";
import type { CheckedState } from "./_components/types";
import { useCalendarSources } from "./_components/use-calendar-sources";

export default function CalendarPage() {
  const [checked, setChecked] = useState<CheckedState>(() =>
    CALENDAR_SOURCES.reduce((acc, source) => {
      acc[source.id] = false;
      return acc;
    }, {} as CheckedState),
  );

  const { events, loadingState } = useCalendarSources(CALENDAR_SOURCES, checked);

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
            <div className="flex flex-col gap-3">
              {CALENDAR_SOURCES.map((source) => (
                <div className="flex items-center gap-3" key={source.id}>
                  <Checkbox
                    id={source.id}
                    checked={checked[source.id]}
                    onCheckedChange={() => toggleSource(source.id)}
                  />
                  <Label htmlFor={source.id} className="flex-1">
                    {source.label}
                  </Label>
                  {loadingState.loading[source.id] && <span className="text-xs text-muted-foreground">加载中…</span>}
                </div>
              ))}
              <div className="mt-3">
                {Object.entries(loadingState.error).map(([id, msg]) =>
                  msg ? (
                    <div key={id} className="text-sm text-red-600">
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
