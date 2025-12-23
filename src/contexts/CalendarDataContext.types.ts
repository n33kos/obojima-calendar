import type { CalendarDate, Month } from '../types';

export interface CalendarDataContextValue {
  // Data state
  data: any | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;

  // UI state
  selectedDate: CalendarDate | null;
  setSelectedDate: (date: CalendarDate | null) => void;
  displayedMonth: Month | null;
  setDisplayedMonth: (month: Month | null) => void;
  displayedYear: number | null;
  setDisplayedYear: (year: number | null) => void;
  isViewingToday: boolean;

  // Computed values
  currentMonth: Month | null;
  currentYear: number | null;

  // Handlers
  handleDayClick: ((day: number) => void) | undefined;
  handleReturnToToday: () => void;
}
