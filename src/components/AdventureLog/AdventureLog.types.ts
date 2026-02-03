import type { TimelineEntry, CalendarDate } from '@/types';

export interface AdventureLogProps {
  timeline: TimelineEntry[];
  selectedDate: CalendarDate;
  selectedEntryId: string | null;
  currentDate: CalendarDate;
}
