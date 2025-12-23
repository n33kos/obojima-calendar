import type { CalendarDate, Month } from './types';

/**
 * Creates a handler for day click events
 * Returns a new date object with the selected day and month
 */
export function createHandleDayClick(
  currentDate: CalendarDate,
  currentMonth: Month,
  setSelectedDate: (date: CalendarDate | null) => void
) {
  return (day: number) => {
    setSelectedDate({
      ...currentDate,
      month: currentMonth,
      day,
      weekday: currentDate.weekday, // Will be recalculated by getWeekday
    });
  };
}

/**
 * Creates a handler to return to the current date
 * Resets both selected date and displayed month
 */
export function createHandleReturnToToday(
  setSelectedDate: (date: CalendarDate | null) => void,
  setDisplayedMonth: (month: Month | null) => void
) {
  return () => {
    setSelectedDate(null);
    setDisplayedMonth(null);
  };
}
