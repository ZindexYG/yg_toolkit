"use client";

import { useMemo, useState } from "react";

import { Controls } from "./_components/controls";
import { MarkimgContext, type MarkimgControls } from "./_components/markimg-context";
import { Preview } from "./_components/preview";

export default function MarkimgPage() {
  const [controls, setControls] = useState<MarkimgControls | null>(null);
  const value = useMemo(() => ({ controls, setControls }), [controls]);

  return (
    <MarkimgContext.Provider value={value}>
      <div className="flex h-full w-full gap-4">
        <div className="h-full w-1/2 flex-1">
          <Controls />
        </div>
        <div className="h-full w-1/2 flex-1">
          <Preview />
        </div>
      </div>
    </MarkimgContext.Provider>
  );
}
