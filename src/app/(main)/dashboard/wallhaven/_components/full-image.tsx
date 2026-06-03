"use client";

import { X } from "lucide-react";

interface FullImageProps {
  fullName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FullImage({ fullName, isOpen, onClose }: FullImageProps) {
  if (!isOpen) return null;

  const id = fullName.replace("wallhaven-", "").replace(".jpg", "");
  const pathPart = id.substring(0, 2).toLowerCase();
  const fullImageUrl = `https://w.wallhaven.cc/full/${pathPart}/${fullName}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <img src={fullImageUrl} alt={fullName} className="h-auto max-h-[90vh] w-auto max-w-[90vw] object-contain" />
        <button
          type="button"
          className="absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/80"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
