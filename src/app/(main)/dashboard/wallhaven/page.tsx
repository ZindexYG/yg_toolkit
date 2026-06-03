"use client";

import { useEffect, useState } from "react";

import { ImageGallery } from "./_components/image-gallery";
import type { WallhavenStructure } from "./_components/types";
import wallhavenStructure from "./_components/wallhaven_structure.json";

export default function WallhavenPage() {
  const [data, setData] = useState<WallhavenStructure | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reversed = [...wallhavenStructure.directories].reverse();
    setData({ ...wallhavenStructure, directories: reversed });
    setLoading(false);
  }, []);

  if (loading) return <div className="p-4">加载中...</div>;
  if (!data) return <div className="p-4">没有找到数据</div>;

  return (
    <div className="h-full w-full overflow-x-hidden">
      <div className="flex flex-col gap-8">
        {data.directories.map((directory, index) => (
          <ImageGallery key={index} date={directory.date} images={directory.images} />
        ))}
      </div>
    </div>
  );
}
