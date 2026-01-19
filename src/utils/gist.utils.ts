import type {
  GistData,
  CurrentState,
  CalendarDate,
  TimelineEntry,
} from "@/types";
import { getWeekday } from "./calendar.utils";

/**
 * Utilities for fetching and parsing calendar data
 */

/**
 * Fetch data from local fallback file
 */
async function fetchLocalData(): Promise<GistData> {
  const response = await fetch("/default-data.json");

  if (!response.ok) {
    throw new Error("Failed to load local fallback data");
  }

  const data = await response.json();
  return data as GistData;
}

/**
 * Fetch data from a URL with fallback to local file
 */
export async function fetchCalendarData(dataUrl: string): Promise<GistData> {
  // Try to fetch from URL first
  try {
    if (!dataUrl) {
      throw new Error("No data URL provided");
    }

    console.log("Attempting to fetch from URL:", dataUrl);
    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✓ Successfully loaded data from remote URL");
    return data as GistData;
  } catch (error) {
    // If remote fetch fails, fall back to local file
    console.warn(
      "Failed to fetch from remote, falling back to local data:",
      error,
    );
    console.log("Loading from /default-data.json...");

    try {
      const localData = await fetchLocalData();
      console.log("✓ Successfully loaded local fallback data");
      return localData;
    } catch (localError) {
      console.error("Failed to load local fallback data:", localError);
      throw new Error(
        "Failed to load data from both remote and local fallback",
      );
    }
  }
}

/**
 * Transform raw data into application state
 */
export function transformCalendarData(data: GistData): CurrentState {
  const { currentDate, currentTime, timeline = [] } = data;

  // Debug: log timeline entries to verify data
  console.log("Timeline entries received:", timeline.length);
  timeline.forEach((entry) => {
    console.log(`  - ${entry.title}: ${entry.month} ${entry.day}, ${entry.year}`);
  });

  const date: CalendarDate = {
    year: currentDate.year,
    era: currentDate.era,
    month: currentDate.month,
    day: currentDate.day,
    weekday:
      currentDate.month === "VeilDay"
        ? "Rest Day"
        : getWeekday(currentDate.day),
  };

  // Use new timeline format
  const timelineEntries: TimelineEntry[] = timeline.map((entry) => ({
    id: entry.id,
    type: entry.type,
    title: entry.title,
    description: entry.description,
    isImportant: entry.isImportant,
    sessionNumber: entry.sessionNumber,
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
      weekday: entry.month === "VeilDay" ? "Rest Day" : getWeekday(entry.day),
    },
  }));

  // Sort timeline by date (year, then month number, then day)
  timelineEntries.sort((a, b) => {
    if (a.date.year !== b.date.year) return b.date.year - a.date.year;

    // Convert month to number for comparison (13 months + Veil Day)
    const monthOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apu",
      "Mei",
      "Jun",
      "Jol",
      "Ogg",
      "Sep",
      "Ock",
      "Nov",
      "Dez",
      "Vell",
      "VeilDay",
    ];
    const aMonthNum = monthOrder.indexOf(a.date.month);
    const bMonthNum = monthOrder.indexOf(b.date.month);

    if (aMonthNum !== bMonthNum) return bMonthNum - aMonthNum;
    return b.date.day - a.date.day;
  });

  return {
    date,
    time: currentTime,
    timeline: timelineEntries,
  };
}

/**
 * Create example data structure (for documentation/setup)
 */
export function createExampleData(): GistData {
  return {
    currentDate: {
      year: 327,
      era: "AD",
      month: "Sep",
      day: 13,
    },
    currentTime: {
      bell: 3,
      knot: 2,
    },
    timeline: [
      {
        id: "1",
        type: "event",
        title: "Festival of Lanterns",
        year: 327,
        era: "AD",
        month: "Ock",
        day: 15,
        description: "Annual celebration in the town square",
        isImportant: true,
      },
      {
        id: "session-1",
        type: "session",
        sessionNumber: 1,
        title: "The Journey Begins",
        year: 327,
        era: "AD",
        month: "Sep",
        day: 10,
        summary:
          "Our heroes met in the village of Windwhisper and accepted a quest to investigate strange occurrences in the nearby forest.",
        highlights: [
          "Met the mysterious elder who spoke in riddles",
          "Discovered ancient ruins hidden in the forest",
          "Fought off a pack of shadow wolves",
        ],
        npcsEncountered: ["Elder Kaito", "Merchant Yumi", "Guard Captain Hiro"],
        locationsVisited: [
          "Windwhisper Village",
          "The Whispering Woods",
          "Ancient Shrine Ruins",
        ],
        itemsAcquired: ["Map Fragment", "Silver Bell", "Healing Potion (x3)"],
      },
    ],
  };
}
