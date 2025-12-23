import type { CalendarDate, CalendarEvent, Month } from '@/types';

export interface CalendarProps {
  currentDate: CalendarDate;
  displayedMonth: Month;
  displayedYear: number;
  selectedDate: CalendarDate | null;
  events?: CalendarEvent[];
  onDateClick?: (day: number) => void;
  onMonthChange?: (month: Month) => void;
  onYearChange?: (year: number) => void;
}
