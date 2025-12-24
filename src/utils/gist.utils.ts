import type {
  GistData,
  CurrentState,
  CalendarDate,
  TimelineEntry,
} from "@/types";
import { getWeekday } from "./calendar.utils";

/**
 * Utilities for fetching and parsing GitHub Gist data
 */

const GIST_RAW_URL_TEMPLATE =
  "https://gist.githubusercontent.com/{username}/{gist_id}/raw/{filename}";

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
 * Fetch data from a GitHub Gist with fallback to local file
 */
export async function fetchGistData(
  username: string,
  gistId: string,
  filename: string = "obojima-calendar.json"
): Promise<GistData> {
  // Try to fetch from GitHub Gist first
  try {
    const url = GIST_RAW_URL_TEMPLATE.replace("{username}", username)
      .replace("{gist_id}", gistId)
      .replace("{filename}", filename);

    console.log("Attempting to fetch from Gist:", url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Gist fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✓ Successfully loaded data from GitHub Gist");
    return data as GistData;
  } catch (error) {
    // If Gist fetch fails, fall back to local file
    console.warn(
      "Failed to fetch from Gist, falling back to local data:",
      error
    );
    console.log("Loading from /default-data.json...");

    try {
      const localData = await fetchLocalData();
      console.log("✓ Successfully loaded local fallback data");
      return localData;
    } catch (localError) {
      console.error("Failed to load local fallback data:", localError);
      throw new Error("Failed to load data from both Gist and local fallback");
    }
  }
}

/**
 * Transform gist data into application state
 */
export function transformGistData(gistData: GistData): CurrentState {
  const { currentDate, currentTime, timeline = [] } = gistData;

  const date: CalendarDate = {
    year: currentDate.year,
    era: currentDate.era,
    month: currentDate.month,
    day: currentDate.day,
    weekday:
      currentDate.month === "Vell" ? "Rest Day" : getWeekday(currentDate.day),
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
      weekday: entry.month === "Vell" ? "Rest Day" : getWeekday(entry.day),
    },
  }));

  // Sort timeline by date (year, then month number, then day)
  timelineEntries.sort((a, b) => {
    if (a.date.year !== b.date.year) return b.date.year - a.date.year;

    // Convert month to number for comparison
    const monthOrder = [
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
 * Create example gist data structure (for documentation/setup)
 */
export function createExampleGistData(): GistData {
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
