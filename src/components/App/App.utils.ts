import type { CalendarDate, Month } from "../../types";

/**
 * Creates a handler for day click events
 * If clicking on the current date, returns to today (clears selection)
 * Otherwise, sets the selected date
 * If an entryId is provided, also sets the selected entry ID
 */
export function createHandleDayClick(
  currentDate: CalendarDate,
  displayedMonth: Month,
  setSelectedDate: (date: CalendarDate | null) => void,
  setDisplayedMonth: (month: Month | null) => void,
  setSelectedEntryId: (entryId: string | null) => void
) {
  return (day: number, entryId?: string) => {
    // Check if clicking on the current date
    const isCurrentDate =
      currentDate.day === day && currentDate.month === displayedMonth;

    if (isCurrentDate && !entryId) {
      // Return to today by clearing selection (only if not clicking a specific entry)
      setSelectedDate(null);
      setDisplayedMonth(null);
      setSelectedEntryId(null);
    } else {
      // Select the clicked date
      setSelectedDate({
        ...currentDate,
        month: displayedMonth,
        day,
        weekday: currentDate.weekday, // Will be recalculated by getWeekday
      });
      // Set the specific entry ID if provided, otherwise clear it
      setSelectedEntryId(entryId || null);
    }
  };
}
