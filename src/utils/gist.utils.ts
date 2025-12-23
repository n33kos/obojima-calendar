import type { GistData, CurrentState, CalendarDate, CalendarEvent, AdventureLogEntry } from '@/types';
import { getWeekday } from './calendar.utils';

/**
 * Utilities for fetching and parsing GitHub Gist data
 */

const GIST_RAW_URL_TEMPLATE = 'https://gist.githubusercontent.com/{username}/{gist_id}/raw/{filename}';

/**
 * Fetch data from local fallback file
 */
async function fetchLocalData(): Promise<GistData> {
  const response = await fetch('/default-data.json');

  if (!response.ok) {
    throw new Error('Failed to load local fallback data');
  }

  const data = await response.json();
  return data as GistData;
}

/**
 * Fetch data from a GitHub Gist with fallback to local file
 */
export async function fetchGistData(
  username: string,
  gistId: string,
  filename: string = 'obojima-calendar.json'
): Promise<GistData> {
  // Try to fetch from GitHub Gist first
  try {
    const url = GIST_RAW_URL_TEMPLATE
      .replace('{username}', username)
      .replace('{gist_id}', gistId)
      .replace('{filename}', filename);

    console.log('Attempting to fetch from Gist:', url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Gist fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✓ Successfully loaded data from GitHub Gist');
    return data as GistData;
  } catch (error) {
    // If Gist fetch fails, fall back to local file
    console.warn('Failed to fetch from Gist, falling back to local data:', error);
    console.log('Loading from /default-data.json...');

    try {
      const localData = await fetchLocalData();
      console.log('✓ Successfully loaded local fallback data');
      return localData;
    } catch (localError) {
      console.error('Failed to load local fallback data:', localError);
      throw new Error('Failed to load data from both Gist and local fallback');
    }
  }
}

/**
 * Transform gist data into application state
 */
export function transformGistData(gistData: GistData): CurrentState {
  const { currentDate, currentTime, events = [], adventureLog = [] } = gistData;

  const date: CalendarDate = {
    year: currentDate.year,
    era: currentDate.era,
    month: currentDate.month,
    day: currentDate.day,
    weekday: currentDate.month === 'Veil' ? 'Rest Day' : getWeekday(currentDate.day),
  };

  const calendarEvents: CalendarEvent[] = events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    isImportant: event.isImportant,
    date: {
      year: event.year,
      era: event.era,
      month: event.month,
      day: event.day,
      weekday: event.month === 'Veil' ? 'Rest Day' : getWeekday(event.day),
    },
  }));

  const logEntries: AdventureLogEntry[] = adventureLog.map((entry) => ({
    id: entry.id,
    sessionNumber: entry.sessionNumber,
    title: entry.title,
    summary: entry.summary,
    highlights: entry.highlights,
    npcsEncountered: entry.npcsEncountered,
    locationsVisited: entry.locationsVisited,
    itemsAcquired: entry.itemsAcquired,
    date: {
      year: entry.year,
      era: entry.era,
      month: entry.month,
      day: entry.day,
      weekday: entry.month === 'Veil' ? 'Rest Day' : getWeekday(entry.day),
    },
  }));

  return {
    date,
    time: currentTime,
    events: calendarEvents,
    adventureLog: logEntries,
  };
}

/**
 * Create example gist data structure (for documentation/setup)
 */
export function createExampleGistData(): GistData {
  return {
    currentDate: {
      year: 327,
      era: 'AD',
      month: 'Sep',
      day: 13,
    },
    currentTime: {
      bell: 3,
      knot: 2,
    },
    events: [
      {
        id: '1',
        title: 'Festival of Lanterns',
        year: 327,
        era: 'AD',
        month: 'Ock',
        day: 15,
        description: 'Annual celebration in the town square',
        isImportant: true,
      },
    ],
    adventureLog: [
      {
        id: 'session-1',
        sessionNumber: 1,
        title: 'The Journey Begins',
        year: 327,
        era: 'AD',
        month: 'Sep',
        day: 10,
        summary: 'Our heroes met in the village of Windwhisper and accepted a quest to investigate strange occurrences in the nearby forest.',
        highlights: [
          'Met the mysterious elder who spoke in riddles',
          'Discovered ancient ruins hidden in the forest',
          'Fought off a pack of shadow wolves',
        ],
        npcsEncountered: ['Elder Kaito', 'Merchant Yumi', 'Guard Captain Hiro'],
        locationsVisited: ['Windwhisper Village', 'The Whispering Woods', 'Ancient Shrine Ruins'],
        itemsAcquired: ['Map Fragment', 'Silver Bell', 'Healing Potion (x3)'],
      },
    ],
  };
}
