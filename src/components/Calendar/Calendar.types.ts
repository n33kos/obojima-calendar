import type { CalendarDate, CalendarEvent, Month } from '@/types';

export interface CalendarProps {
  currentDate: CalendarDate;
  displayedMonth: Month;
  selectedDate: CalendarDate | null;
  events?: CalendarEvent[];
  onDateClick?: (day: number) => void;
  onMonthChange?: (month: Month) => void;
}
