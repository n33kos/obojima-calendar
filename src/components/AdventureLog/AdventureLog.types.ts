import type { AdventureLogEntry, CalendarDate } from '@/types';

export interface AdventureLogProps {
  entries: AdventureLogEntry[];
  selectedDate: CalendarDate;
  currentDate: CalendarDate;
}
