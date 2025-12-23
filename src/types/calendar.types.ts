/**
 * Calendar system types for Obojima
 */

export type Month =
  | 'Jan' | 'Feb' | 'Mar' | 'Apu' | 'Mei' | 'Jun'
  | 'Jol' | 'Aug' | 'Sep' | 'Ock' | 'Nov' | 'Dez' | 'Vell';

export type Weekday =
  | 'Tide Day'
  | 'Leaf Day'
  | 'Bell Day'
  | 'Hearth Day'
  | 'Gale Day'
  | 'Star Day'
  | 'Rest Day';

export type Era = 'AF' | 'AN' | 'AH' | 'AD' | 'LW';

export interface MonthInfo {
  name: Month;
  abbrev: string;
  number: number;
  notes: string;
}

export interface CalendarDate {
  year: number;
  era: Era;
  month: Month | 'Veil';
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
  events?: CalendarEvent[];
  adventureLog?: AdventureLogEntry[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: CalendarDate;
  description?: string;
  isImportant?: boolean;
}

export interface AdventureLogEntry {
  id: string;
  sessionNumber: number;
  title: string;
  date: CalendarDate;
  summary: string;
  highlights?: string[];
  npcsEncountered?: string[];
  locationsVisited?: string[];
  itemsAcquired?: string[];
}

export interface GistData {
  currentDate: {
    year: number;
    era: Era;
    month: Month | 'Veil';
    day: number;
  };
  currentTime: {
    bell: number;
    knot: number;
  };
  events?: Array<{
    id: string;
    title: string;
    year: number;
    era: Era;
    month: Month | 'Veil';
    day: number;
    description?: string;
    isImportant?: boolean;
  }>;
  adventureLog?: Array<{
    id: string;
    sessionNumber: number;
    title: string;
    year: number;
    era: Era;
    month: Month | 'Veil';
    day: number;
    summary: string;
    highlights?: string[];
    npcsEncountered?: string[];
    locationsVisited?: string[];
    itemsAcquired?: string[];
  }>;
}
