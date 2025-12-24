import { getMonthInfo } from "@/utils/calendar.utils";
import type { TimelineEntry, CalendarDate } from "@/types";

const MONTH_ORDER = [
  "Jan",
  "Feb",
  "Mar",
  "Apu",
  "Mei",
  "Jun",
  "Jol",
  "Aug",
  "Sep",
  "Ock",
  "Nov",
  "Dez",
  "Vell",
];

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
 * Find the nearest timeline entry (session) to the selected date
 * Returns the most recent entry on or before the selected date,
 * or the oldest entry if no past entries exist
 */
export function findNearestEntry(
  entries: TimelineEntry[],
  selectedDate: CalendarDate
): TimelineEntry | null {
  if (entries.length === 0) return null;

  const selectedNum = dateToNumber(selectedDate);

  // Find entries on or before the selected date
  const pastEntries = entries.filter((entry) => {
    const entryNum = dateToNumber(entry.date);
    return entryNum <= selectedNum;
  });

  // Return the most recent past entry (by date, then by session number if available)
  if (pastEntries.length > 0) {
    return pastEntries.reduce((latest, current) => {
      const latestNum = dateToNumber(latest.date);
      const currentNum = dateToNumber(current.date);

      if (currentNum > latestNum) return current;
      if (currentNum < latestNum) return latest;

      // Same date - prefer entry with higher session number
      if (current.sessionNumber && latest.sessionNumber) {
        return current.sessionNumber > latest.sessionNumber ? current : latest;
      }

      return current;
    });
  }

  // If no past entries, return the oldest entry
  return entries.reduce((oldest, current) => {
    const oldestNum = dateToNumber(oldest.date);
    const currentNum = dateToNumber(current.date);

    if (currentNum < oldestNum) return current;
    if (currentNum > oldestNum) return oldest;

    // Same date - prefer entry with lower session number
    if (current.sessionNumber && oldest.sessionNumber) {
      return current.sessionNumber < oldest.sessionNumber ? current : oldest;
    }

    return oldest;
  });
}

/**
 * Sort timeline entries chronologically (most recent first)
 * Sessions are prioritized over events on the same date
 */
export function sortTimelineEntries(
  timeline: TimelineEntry[]
): TimelineEntry[] {
  return [...timeline].sort((a, b) => {
    if (a.date.year !== b.date.year) return b.date.year - a.date.year;

    const aMonthNum = MONTH_ORDER.indexOf(a.date.month);
    const bMonthNum = MONTH_ORDER.indexOf(b.date.month);

    if (aMonthNum !== bMonthNum) return bMonthNum - aMonthNum;
    if (a.date.day !== b.date.day) return b.date.day - a.date.day;

    // If dates are equal, sort sessions before events
    if (a.type !== b.type) return a.type === "session" ? -1 : 1;

    // Sessions with higher numbers first
    if (
      a.type === "session" &&
      b.type === "session" &&
      a.sessionNumber &&
      b.sessionNumber
    ) {
      return b.sessionNumber - a.sessionNumber;
    }

    return 0;
  });
}
