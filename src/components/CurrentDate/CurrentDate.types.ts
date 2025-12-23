import type { CalendarDate, TimeOfDay } from '@/types';

export interface CurrentDateProps {
  date: CalendarDate;
  time: TimeOfDay;
  isViewingToday?: boolean;
  onReturnToToday?: () => void;
}
