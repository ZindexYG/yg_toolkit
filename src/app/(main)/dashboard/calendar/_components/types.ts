import type { EventInput } from "@fullcalendar/core";

export interface CalendarSource {
  id: string;
  label: string;
  url: string;
  group?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
}

export interface EventWithSource extends EventInput {
  _srcId?: string;
}

export interface SourceLoadingState {
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
}

export type CheckedState = Record<string, boolean>;
