import {
  Calendar as CalendarIcon,
  ImageIcon,
  ImageMinus,
  ImagePlus,
  Inbox as InboxIcon,
  type LucideIcon,
  Watch,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "工具箱",
    items: [
      { title: "编号生成器", url: "/dashboard/generator", icon: InboxIcon },
      { title: "图片水印工具", url: "/dashboard/markimg", icon: ImagePlus },
      { title: "节假日日历", url: "/dashboard/calendar", icon: CalendarIcon },
      { title: "时间格式互转", url: "/dashboard/timestamp", icon: Watch },
      { title: "纯色背景移除", url: "/dashboard/bgremove", icon: ImageMinus, comingSoon: true },
      { title: "Wallhaven", url: "/dashboard/wallhaven", icon: ImageIcon },
    ],
  },
];
