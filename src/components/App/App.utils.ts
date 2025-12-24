import type { CalendarDate, Month } from "../../types";

/**
 * Creates a handler for day click events
 * If clicking on the current date, returns to today (clears selection)
 * Otherwise, sets the selected date
 */
export function createHandleDayClick(
  currentDate: CalendarDate,
  displayedMonth: Month,
  setSelectedDate: (date: CalendarDate | null) => void,
  setDisplayedMonth: (month: Month | null) => void
) {
  return (day: number) => {
    // Check if clicking on the current date
    const isCurrentDate =
      currentDate.day === day && currentDate.month === displayedMonth;

    if (isCurrentDate) {
      // Return to today by clearing selection
      setSelectedDate(null);
      setDisplayedMonth(null);
    } else {
      // Select the clicked date
      setSelectedDate({
        ...currentDate,
        month: displayedMonth,
        day,
        weekday: currentDate.weekday, // Will be recalculated by getWeekday
      });
    }
  };
}
