import { getMonthByNumber } from '@/utils/calendar.utils';
import type { Month } from '@/types';

/**
 * Creates a handler for day click events
 */
export function createHandleDayClick(onDateClick?: (day: number) => void) {
  return (day: number) => {
    onDateClick?.(day);
  };
}

/**
 * Creates a handler for navigating to the previous month
 */
export function createHandlePrevMonth(
  currentMonthNumber: number,
  onMonthChange?: (month: Month) => void
) {
  return () => {
    const prevMonthNum = currentMonthNumber === 1 ? 13 : currentMonthNumber - 1;
    const prevMonth = getMonthByNumber(prevMonthNum);
    if (prevMonth) {
      onMonthChange?.(prevMonth.name as Month);
    }
  };
}

/**
 * Creates a handler for navigating to the next month
 */
export function createHandleNextMonth(
  currentMonthNumber: number,
  onMonthChange?: (month: Month) => void
) {
  return () => {
    const nextMonthNum = currentMonthNumber === 13 ? 1 : currentMonthNumber + 1;
    const nextMonth = getMonthByNumber(nextMonthNum);
    if (nextMonth) {
      onMonthChange?.(nextMonth.name as Month);
    }
  };
}
