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
 * 14 navigable slots: 13 months (1-13) + Veil Day (14)
 */
export function createHandlePrevMonth(
  currentMonthNumber: number,
  onMonthChange?: (month: Month) => void
) {
  return () => {
    const prevMonthNum = currentMonthNumber === 1 ? 14 : currentMonthNumber - 1;
    const prevMonth = getMonthByNumber(prevMonthNum);
    if (prevMonth) {
      onMonthChange?.(prevMonth.name as Month);
    }
  };
}

/**
 * Creates a handler for navigating to the next month
 * 14 navigable slots: 13 months (1-13) + Veil Day (14)
 */
export function createHandleNextMonth(
  currentMonthNumber: number,
  onMonthChange?: (month: Month) => void
) {
  return () => {
    const nextMonthNum = currentMonthNumber === 14 ? 1 : currentMonthNumber + 1;
    const nextMonth = getMonthByNumber(nextMonthNum);
    if (nextMonth) {
      onMonthChange?.(nextMonth.name as Month);
    }
  };
}
