"use client";

import * as React from "react";

import { Calendar as CalendarIcon, ImageIcon, ImageMinus, ImagePlus, Inbox, Search, Watch } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const searchItems = [
  { group: "工具箱", icon: Inbox, label: "编号生成器" },
  { group: "工具箱", icon: ImagePlus, label: "图片水印工具" },
  { group: "工具箱", icon: CalendarIcon, label: "节假日日历" },
  { group: "工具箱", icon: Watch, label: "时间格式互转" },
  { group: "工具箱", icon: ImageMinus, label: "纯色背景移除", disabled: true },
  { group: "工具箱", icon: ImageIcon, label: "Wallhaven" },
];

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="link"
        className="!px-0 font-normal text-muted-foreground hover:no-underline"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        Search
        <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium text-[10px]">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="搜索工具…" />
        <CommandList>
          <CommandEmpty>未找到结果。</CommandEmpty>
          {[...new Set(searchItems.map((item) => item.group))].map((group) => (
            <CommandGroup heading={group} key={group}>
              {searchItems
                .filter((item) => item.group === group)
                .map((item) => (
                  <CommandItem className="!py-1.5" key={item.label} onSelect={() => setOpen(false)}>
                    {item.icon && <item.icon />}
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
