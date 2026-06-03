"use client";

import { useEffect, useState } from "react";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LocaleDateOption = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
} as const;

export function Unix({ now }: { now: Date | null }) {
  const [timeUnit, setTimeUnit] = useState<"seconds" | "milliseconds">("seconds");
  const [, setTimestamp] = useState<number | null>(null);
  const [inputTimestamp, setInputTimestamp] = useState("");
  const [outputDateTime, setOutputDateTime] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [dateString, setDateString] = useState<string>("");
  const [timeString, setTimeString] = useState<string>("00:00:00");
  const [outputTimestamp, setOutputTimestamp] = useState<string>("");

  const getCurrentTimestamp = () => {
    if (!now) return;
    const currentTime = now.getTime();
    setInputTimestamp(String(timeUnit === "seconds" ? Math.floor(currentTime / 1000) : currentTime));
  };

  const convertTimestampToDate = () => {
    if (!inputTimestamp) return;
    const ts = Number(inputTimestamp);
    if (Number.isNaN(ts)) return;
    const date = timeUnit === "seconds" ? new Date(ts * 1000) : new Date(ts);
    const options = Object.assign({}, LocaleDateOption, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    } as const);
    const formattedDate =
      timeUnit === "seconds"
        ? date.toLocaleDateString(undefined, options)
        : `${date.toLocaleDateString(undefined, options)} ${date.getMilliseconds()}`;
    setOutputDateTime(formattedDate);
  };

  const reset = () => {
    setInputTimestamp("");
    setOutputDateTime("");
    setTimestamp(null);
  };

  useEffect(() => {
    reset();
  }, [timeUnit]);

  const getCurrentDateTime = () => {
    if (!now) return;
    const options = Object.assign({}, LocaleDateOption, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    } as const);
    const formattedDate = now.toLocaleDateString(undefined, options);
    setDateString(now.toLocaleDateString(undefined, LocaleDateOption));
    setTimeString(formattedDate.split(" ")[1]);
  };

  const convertDateToTimestamp = () => {
    if (!dateString || !timeString) return;
    const date = new Date(`${dateString} ${timeString}`);
    setOutputTimestamp(String(Math.floor(date.getTime() / 1000)));
  };

  return (
    <div className="space-y-4 p-4">
      <h3 className="flex items-center justify-baseline gap-2">
        <span className="text-md">时间戳转日期时间</span>
        <Select defaultValue="seconds" onValueChange={(value) => setTimeUnit(value as "seconds" | "milliseconds")}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="选择时间单位" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seconds">秒 (10位)</SelectItem>
            <SelectItem value="milliseconds">毫秒 (13位)</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={getCurrentTimestamp}>
          获取当前时间戳
        </Button>
      </h3>

      <div className="flex gap-2">
        <Input
          type="number"
          value={inputTimestamp}
          onChange={(e) => setInputTimestamp(e.target.value)}
          placeholder="请输入时间戳"
        />
        <Button variant="outline" onClick={convertTimestampToDate}>
          转换
        </Button>
        <Input value={outputDateTime} readOnly />
      </div>

      <h3 className="flex items-center justify-baseline gap-2">
        <span className="text-md">日期时间转时间戳</span>
        <Button variant="outline" onClick={getCurrentDateTime}>
          获取当前时间
        </Button>
      </h3>

      <div className="flex gap-2">
        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" id="date-picker" className="justify-between font-normal">
                {dateString || "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={dateString ? new Date(dateString) : undefined}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (!date) return;
                  setDateString(date.toLocaleDateString(undefined, LocaleDateOption));
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            step="1"
            defaultValue="00:00:00"
            value={timeString}
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            onChange={(e) => setTimeString(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={convertDateToTimestamp}>
          转换
        </Button>
        <Input value={outputTimestamp} readOnly />
      </div>
    </div>
  );
}
