import type { Month, MonthInfo, Weekday, CalendarDate } from '@/types';

/**
 * Calendar constants and utilities for Obojima calendar system
 */

export const MONTHS: MonthInfo[] = [
  { name: 'Jan', abbrev: 'JAN', number: 1, notes: 'cold clarity, new routes' },
  { name: 'Feb', abbrev: 'FEB', number: 2, notes: 'thaw, first green' },
  { name: 'Mar', abbrev: 'MAR', number: 3, notes: 'winds, restlessness' },
  { name: 'Apu', abbrev: 'APU', number: 4, notes: 'rains, repairs' },
  { name: 'Mei', abbrev: 'MEI', number: 5, notes: 'blossoms, courting' },
  { name: 'Jun', abbrev: 'JUN', number: 6, notes: 'bright days' },
  { name: 'Jol', abbrev: 'JOL', number: 7, notes: 'heat, festivals' },
  { name: 'Aug', abbrev: 'AUG', number: 8, notes: 'heavy fruit' },
  { name: 'Sep', abbrev: 'SEP', number: 9, notes: 'harvest begins' },
  { name: 'Ock', abbrev: 'OCK', number: 10, notes: 'lanterns, long shadows' },
  { name: 'Nov', abbrev: 'NOV', number: 11, notes: 'fogs, quiet markets' },
  { name: 'Dez', abbrev: 'DEZ', number: 12, notes: 'frost, hearths' },
  { name: 'Vell', abbrev: 'VEL', number: 13, notes: '"thin sky" month; spirits nearer' },
];

export const WEEKDAYS: Weekday[] = [
  'Tide Day',
  'Leaf Day',
  'Bell Day',
  'Hearth Day',
  'Gale Day',
  'Star Day',
  'Rest Day',
];

export const DAYS_PER_MONTH = 28;
export const DAYS_PER_WEEK = 7;
export const WEEKS_PER_MONTH = 4;
export const MONTHS_PER_YEAR = 13;
export const BELLS_PER_DAY = 8;
export const KNOTS_PER_BELL = 6;

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
 * Format a calendar date in common notation
 */
export function formatDate(date: CalendarDate): string {
  if (date.month === 'Veil') {
    return `${date.era} ${date.year}, Veil Day`;
  }
  return `${date.era} ${date.year}, ${date.month} ${date.day}`;
}

/**
 * Format a calendar date with weekday
 */
export function formatDateWithWeekday(date: CalendarDate): string {
  if (date.month === 'Veil') {
    return `${date.era} ${date.year}, Veil Day`;
  }
  return `${date.weekday}, ${date.month} ${date.day}, ${date.era} ${date.year}`;
}

/**
 * Check if a date is Veil Day
 */
export function isVeilDay(month: Month | 'Veil'): boolean {
  return month === 'Veil';
}

/**
 * Generate calendar grid for a month (array of day numbers 1-28)
 */
export function generateMonthGrid(): number[] {
  return Array.from({ length: DAYS_PER_MONTH }, (_, i) => i + 1);
}

/**
 * Generate calendar grid grouped by weeks
 */
export function generateMonthGridByWeeks(): number[][] {
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
