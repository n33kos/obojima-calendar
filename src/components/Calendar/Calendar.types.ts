import type { CalendarDate, CalendarEvent } from '@/types';

export interface CalendarProps {
  currentDate: CalendarDate;
  events?: CalendarEvent[];
  onDateClick?: (day: number) => void;
}
