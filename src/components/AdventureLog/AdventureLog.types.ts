import type { AdventureLogEntry, CalendarDate, CalendarEvent } from '@/types';

export interface AdventureLogProps {
  entries: AdventureLogEntry[];
  events: CalendarEvent[];
  selectedDate: CalendarDate;
  currentDate: CalendarDate;
}
