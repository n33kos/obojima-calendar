import { getMonthInfo } from '@/utils/calendar.utils';
import type { AdventureLogEntry, CalendarDate, CalendarEvent } from '@/types';

/**
 * Convert a date to a comparable number (year * 10000 + monthNum * 100 + day)
 * Used for comparing dates chronologically
 */
export function dateToNumber(date: CalendarDate): number {
  const monthInfo = getMonthInfo(date.month as any);
  const monthNum = monthInfo?.number || 0;
  return date.year * 10000 + monthNum * 100 + date.day;
}

/**
 * Filter events that occur on the selected date
 */
export function filterEventsByDate(
  events: CalendarEvent[],
  selectedDate: CalendarDate
): CalendarEvent[] {
  return events.filter((event) => {
    return (
      event.date.year === selectedDate.year &&
      event.date.month === selectedDate.month &&
      event.date.day === selectedDate.day
    );
  });
}

/**
 * Find the nearest adventure log entry to the selected date
 * Returns the most recent entry on or before the selected date,
 * or the oldest entry if no past entries exist
 */
export function findNearestEntry(
  entries: AdventureLogEntry[],
  selectedDate: CalendarDate
): AdventureLogEntry | null {
  if (entries.length === 0) return null;

  const selectedNum = dateToNumber(selectedDate);

  // Find entries on or before the selected date
  const pastEntries = entries.filter((entry) => {
    const entryNum = dateToNumber(entry.date);
    return entryNum <= selectedNum;
  });

  // Return the most recent past entry (highest session number)
  if (pastEntries.length > 0) {
    return pastEntries.reduce((latest, current) =>
      current.sessionNumber > latest.sessionNumber ? current : latest
    );
  }

  // If no past entries, return the oldest entry
  return entries.reduce((oldest, current) =>
    current.sessionNumber < oldest.sessionNumber ? current : oldest
  );
}
