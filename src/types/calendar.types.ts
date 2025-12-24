/**
 * Calendar system types for Obojima
 */

export type Month =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apu"
  | "Mei"
  | "Jun"
  | "Jol"
  | "Aug"
  | "Sep"
  | "Ock"
  | "Nov"
  | "Dez"
  | "Vell";

export type Weekday =
  | "Tide Day"
  | "Leaf Day"
  | "Bell Day"
  | "Hearth Day"
  | "Gale Day"
  | "Star Day"
  | "Rest Day";

export type Era = "AF" | "AN" | "AH" | "AD" | "LW";

export interface MonthInfo {
  name: Month;
  abbrev: string;
  number: number;
  notes: string;
}

export interface CalendarDate {
  year: number;
  era: Era;
  month: Month;
  day: number;
  weekday: Weekday;
}

export interface TimeOfDay {
  bell: number; // 1-8
  knot: number; // 0-5
}

export interface CurrentState {
  date: CalendarDate;
  time: TimeOfDay;
  timeline: TimelineEntry[];
  // Legacy fields for backwards compatibility
  events?: CalendarEvent[];
  adventureLog?: AdventureLogEntry[];
}

export interface TimelineEntry {
  id: string;
  type: "event" | "session";
  title: string;
  date: CalendarDate;

  // Event-specific fields
  description?: string;
  isImportant?: boolean;

  // Session-specific fields
  sessionNumber?: number;
  summary?: string;
  highlights?: string[];
  npcsEncountered?: string[];
  locationsVisited?: string[];
  itemsAcquired?: string[];
}

// Legacy type aliases for backwards compatibility during transition
export type CalendarEvent = TimelineEntry;
export type AdventureLogEntry = TimelineEntry;

export interface GistData {
  currentDate: {
    year: number;
    era: Era;
    month: Month;
    day: number;
  };
  currentTime: {
    bell: number;
    knot: number;
  };
  timeline?: Array<{
    id: string;
    type: "event" | "session";
    title: string;
    year: number;
    era: Era;
    month: Month;
    day: number;
    // Event-specific
    description?: string;
    isImportant?: boolean;
    // Session-specific
    sessionNumber?: number;
    summary?: string;
    highlights?: string[];
    npcsEncountered?: string[];
    locationsVisited?: string[];
    itemsAcquired?: string[];
  }>;
}
