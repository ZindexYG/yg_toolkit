"use client";

import { useState } from "react";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const LocaleDateOption = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
} as const;

export function Iso8601() {
  const [inputISO8601, setInputISO8601] = useState("");
  const [outputDateTime, setOutputDateTime] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [dateString, setDateString] = useState<string>("");
  const [timeString, setTimeString] = useState<string>("00:00:00");
  const [outputISO8601, setOutputISO8601] = useState<string>("");

  const getCurrentTimestamp = () => {
    setInputISO8601(new Date().toISOString());
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    setDateString(now.toLocaleDateString(undefined, LocaleDateOption));
    setTimeString(now.toTimeString().split(" ")[0]);
  };

  const convertISO8601ToDate = () => {
    const date = new Date(inputISO8601);
    setOutputDateTime(date.toLocaleString());
  };

  const convertDateToISO = () => {
    if (!dateString || !timeString) return;
    const date = new Date(`${dateString} ${timeString}`);
    setOutputISO8601(date.toISOString());
  };

  return (
    <div className="space-y-4 p-4">
      <h3 className="flex items-center justify-baseline gap-2">
        <span className="text-md">ISO 8601 转日期时间</span>
        <Button variant="outline" onClick={getCurrentTimestamp}>
          获取当前时间戳
        </Button>
      </h3>
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputISO8601}
          onChange={(e) => setInputISO8601(e.target.value)}
          placeholder="请输入 ISO 8601 字符串"
        />
        <Button variant="outline" onClick={convertISO8601ToDate}>
          转换
        </Button>
        <Input value={outputDateTime} readOnly />
      </div>

      <h3 className="flex items-center justify-baseline gap-2">
        <span className="text-md">日期时间转 ISO 8601</span>
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
        <Button variant="outline" onClick={convertDateToISO}>
          转换
        </Button>
        <Input value={outputISO8601} readOnly />
      </div>
    </div>
  );
}
