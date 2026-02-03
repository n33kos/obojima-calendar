import type {
  Month,
  MonthInfo,
  Weekday,
  CalendarDate,
  TimelineEntry,
} from "@/types";

/**
 * Calendar constants and utilities for Obojima calendar system
 */

export const MONTHS: MonthInfo[] = [
  { name: "Jan", abbrev: "JAN", number: 1, notes: "cold clarity, new routes" },
  { name: "Feb", abbrev: "FEB", number: 2, notes: "thaw, first green" },
  { name: "Mar", abbrev: "MAR", number: 3, notes: "winds, restlessness" },
  { name: "Apu", abbrev: "APU", number: 4, notes: "rains, repairs" },
  { name: "Mei", abbrev: "MEI", number: 5, notes: "blossoms, courting" },
  { name: "Jun", abbrev: "JUN", number: 6, notes: "bright days" },
  { name: "Jol", abbrev: "JOL", number: 7, notes: "heat, festivals" },
  { name: "Ogg", abbrev: "OGG", number: 8, notes: "heavy fruit" },
  { name: "Sep", abbrev: "SEP", number: 9, notes: "harvest begins" },
  { name: "Ock", abbrev: "OCK", number: 10, notes: "lanterns, long shadows" },
  { name: "Nov", abbrev: "NOV", number: 11, notes: "fogs, quiet markets" },
  { name: "Dez", abbrev: "DEZ", number: 12, notes: "frost, hearths" },
  {
    name: "Vell",
    abbrev: "VEL",
    number: 13,
    notes: '"thin sky" month; spirits nearer',
  },
  {
    name: "VeilDay",
    abbrev: "VEIL",
    number: 14,
    notes: "the between-day; outside of time",
  },
];

export const WEEKDAYS: Weekday[] = [
  "Tide Day",
  "Leaf Day",
  "Bell Day",
  "Hearth Day",
  "Gale Day",
  "Star Day",
  "Rest Day",
];

export const DAYS_PER_MONTH = 28;
export const DAYS_PER_WEEK = 7;
export const WEEKS_PER_MONTH = 4;
export const MONTHS_PER_YEAR = 13; // 13 full months
export const NAVIGABLE_SLOTS = 14; // 13 months + Veil Day
export const BELLS_PER_DAY = 8;
export const KNOTS_PER_BELL = 6;
export const VEIL_DAY_DAYS = 1; // Veil Day only has 1 day

/**
 * Get month info by name
 */
export function getMonthInfo(month: Month): MonthInfo | undefined {
  return MONTHS.find((m) => m.name === month);
}

/**
 * Get month info by number (1-13)
 */
export function getMonthByNumber(monthNumber: number): MonthInfo | undefined {
  return MONTHS.find((m) => m.number === monthNumber);
}

/**
 * Calculate which weekday a specific date falls on
 * Based on: each month has exactly 4 weeks (28 days), so day 1 is always the same weekday
 */
export function getWeekday(day: number): Weekday {
  // Day 1-28, find position in week (0-6)
  const weekdayIndex = (day - 1) % DAYS_PER_WEEK;
  return WEEKDAYS[weekdayIndex];
}

/**
 * Get week number within month (1-4)
 */
export function getWeekOfMonth(day: number): number {
  return Math.ceil(day / DAYS_PER_WEEK);
}

/**
 * Format time as Bell:Knot (e.g., "3:2")
 */
export function formatTime(bell: number, knot: number): string {
  return `${bell}:${knot}`;
}

/**
 * Convert Bell:Knot to 12-hour time
 * Each Bell = 3 hours, each Knot = 30 minutes
 * Bell 1 = 3:00 AM, Bell 4 = 12:00 PM (noon)
 */
export function bellKnotTo12Hour(bell: number, knot: number): string {
  const totalMinutes = knot * 30 + bell * 180; // Each knot is 30 minutes, Each Bell is 180 minutes

  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;

  // Determine AM/PM
  const period = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  const displayHours = hours === 12 ? 12 : hours > 12 ? hours - 12 : hours;

  // Format with leading zeros for minutes
  const displayMinutes = minutes.toString().padStart(2, "0");

  return `${displayHours}:${displayMinutes} ${period}`;
}

/**
 * Format a calendar date in common notation
 */
export function formatDate(date: CalendarDate): string {
  return `${date.era} ${date.year}, ${date.month} ${date.day}`;
}

/**
 * Format a calendar date with weekday
 */
export function formatDateWithWeekday(date: CalendarDate): string {
  return `${date.weekday}, ${date.month} ${date.day}, ${date.era} ${date.year}`;
}

/**
 * Check if a month slot is Veil Day (the special between-day outside of time)
 */
export function isVeilDay(month: Month): boolean {
  return month === "VeilDay";
}

/**
 * Get number of days in a month
 */
export function getDaysInMonth(month: Month): number {
  return isVeilDay(month) ? VEIL_DAY_DAYS : DAYS_PER_MONTH;
}

/**
 * Generate calendar grid for a month (array of day numbers)
 */
export function generateMonthGrid(month?: Month): number[] {
  const days = month ? getDaysInMonth(month) : DAYS_PER_MONTH;
  return Array.from({ length: days }, (_, i) => i + 1);
}

/**
 * Generate calendar grid grouped by weeks
 */
export function generateMonthGridByWeeks(month?: Month): number[][] {
  const days = month ? getDaysInMonth(month) : DAYS_PER_MONTH;

  // For Veil Day (1 day), return single array with 1 element
  if (days === 1) {
    return [[1]];
  }

  const weeks: number[][] = [];
  for (let week = 0; week < WEEKS_PER_MONTH; week++) {
    const weekDays: number[] = [];
    for (let day = 0; day < DAYS_PER_WEEK; day++) {
      weekDays.push(week * DAYS_PER_WEEK + day + 1);
    }
    weeks.push(weekDays);
  }
  return weeks;
}

/**
 * Era priority order (earliest to latest)
 * Based on common fantasy era progression
 */
const ERA_ORDER: Record<string, number> = {
  AF: 1, // Age of Founding
  AN: 2, // Age of Nations
  AH: 3, // Age of Heroes
  AD: 4, // Age of Dragons
  LW: 5, // Last War
};

/**
 * Compare two calendar dates
 * Returns:
 *   < 0 if date1 is before date2
 *   0 if dates are equal
 *   > 0 if date1 is after date2
 */
export function compareDates(date1: CalendarDate, date2: CalendarDate): number {
  // Compare era
  const era1Priority = ERA_ORDER[date1.era] || 0;
  const era2Priority = ERA_ORDER[date2.era] || 0;
  if (era1Priority !== era2Priority) {
    return era1Priority - era2Priority;
  }

  // Compare year
  if (date1.year !== date2.year) {
    return date1.year - date2.year;
  }

  // Compare month
  const month1Info = getMonthInfo(date1.month);
  const month2Info = getMonthInfo(date2.month);
  const month1Number = month1Info?.number || 0;
  const month2Number = month2Info?.number || 0;
  if (month1Number !== month2Number) {
    return month1Number - month2Number;
  }

  // Compare day
  return date1.day - date2.day;
}

/**
 * Sort timeline entries chronologically (earliest to latest)
 * For entries on the same day:
 * - Sessions are sorted by sessionNumber
 * - Events maintain their original order
 * - Sessions come before events on the same day
 */
export function sortTimelineEntriesByDate(
  entries: TimelineEntry[]
): TimelineEntry[] {
  return [...entries].sort((a, b) => {
    // First compare dates
    const dateComparison = compareDates(a.date, b.date);
    if (dateComparison !== 0) {
      return dateComparison;
    }

    // Same date - use type and session number to break ties
    // Sessions come before events
    if (a.type === "session" && b.type === "event") {
      return -1;
    }
    if (a.type === "event" && b.type === "session") {
      return 1;
    }

    // Both sessions - sort by session number
    if (a.type === "session" && b.type === "session") {
      const sessionA = a.sessionNumber || 0;
      const sessionB = b.sessionNumber || 0;
      return sessionA - sessionB;
    }

    // Both events - maintain original order (stable sort)
    return 0;
  });
}
