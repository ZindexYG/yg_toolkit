"use client";

import { createContext } from "react";

import type { UseFormReturn } from "react-hook-form";

export interface MarkimgFormValues {
  imageFile: File | null;
  text: string;
  color: string;
  alpha: number;
  angle: number;
  space: number;
  size: number;
  format: "png" | "jpeg" | string;
}

export interface MarkimgControls {
  form: UseFormReturn<MarkimgFormValues>;
  watchedValues: Partial<MarkimgFormValues>;
}

export interface MarkimgContextValue {
  controls: MarkimgControls | null;
  setControls: React.Dispatch<React.SetStateAction<MarkimgControls | null>>;
}

export const MarkimgContext = createContext<MarkimgContextValue | null>(null);
