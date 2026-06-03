"use client";

import { useState } from "react";

import { Download, Link as LinkIcon, ScanSearch } from "lucide-react";

import { cn } from "@/lib/utils";

interface SimpleImageProps {
  fullName: string;
  simpleName: string;
  onClick?: () => void;
  className?: string;
}

export function SimpleImage({ fullName, simpleName, onClick, className }: SimpleImageProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const id = fullName.replace("wallhaven-", "").replace(".jpg", "");
  const pathPart = simpleName.substring(0, 2).toLowerCase();
  const thumbnailUrl = `https://th.wallhaven.cc/small/${pathPart}/${simpleName}`;
  const pageUrl = `https://wallhaven.cc/w/${id}`;
  const fullUrl = `https://w.wallhaven.cc/full/${pathPart}/${fullName}`;

  const handleDownload = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error(`下载失败: ${response.status} ${response.statusText}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fullName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error("下载图片失败:", error);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  return (
    <div
      className={cn("relative cursor-pointer overflow-hidden rounded-md", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img src={thumbnailUrl} alt={fullName} className="h-auto w-full object-cover" loading="lazy" />
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-200",
          isHovering ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="flex space-x-4">
          <ScanSearch
            className="h-5 w-5 cursor-pointer text-white transition-transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          />
          <LinkIcon
            className="h-5 w-5 cursor-pointer text-white transition-transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              window.open(pageUrl, "_blank");
            }}
          />
          <Download
            className={cn(
              "h-5 w-5 cursor-pointer text-white transition-transform hover:scale-110",
              isDownloading && "animate-pulse",
            )}
            onClick={handleDownload}
          />
        </div>
      </div>
    </div>
  );
}
