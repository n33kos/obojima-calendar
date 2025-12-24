import type { TimelineEntry } from "@/types";

export interface AdventureLogEntryProps {
  entry: TimelineEntry;
  isNearest: boolean;
  entryRef: (el: HTMLDivElement | null) => void;
}
