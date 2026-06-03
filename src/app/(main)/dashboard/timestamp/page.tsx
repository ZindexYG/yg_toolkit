"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Iso8601 } from "./_components/iso-8601";
import { Unix } from "./_components/unix";

const TABS = [
  {
    title: "ISO 8601",
    value: "iso8601",
    component: Iso8601,
    desc: "`2023-10-13T12:00:00Z` 或 `2023-10-13T12:00:00+08:00`",
  },
  {
    title: "Unix",
    value: "unix",
    component: Unix,
    desc: "`1697184000`",
  },
];

const FORMAT_OPTIONS = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
} as const;

export default function TimestampPage() {
  const [now, setNow] = useState<Date | null>(null);
  const intervalRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    setNow(new Date());
    intervalRef.current = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const localeString = now ? now.toLocaleString("zh-CN", FORMAT_OPTIONS) : "";

  return (
    <Card className="flex w-full justify-center">
      <CardHeader>
        当前时间：{localeString}
        <Alert>
          <AlertDescription>
            <ul className="list-inside text-sm">
              {TABS.map((item) => (
                <li key={item.value} className="flex">
                  <div className="w-20 font-mono font-medium">{item.title}</div>
                  例如：<code>{item.desc}</code>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="iso8601">
          <TabsList className="flex h-24 w-full flex-wrap justify-around sm:h-12">
            {TABS.map((item) => (
              <TabsTrigger className="h-9 sm:h-full" value={item.value} key={item.value}>
                {item.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((item) => (
            <TabsContent value={item.value} key={item.value}>
              <item.component now={now} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
