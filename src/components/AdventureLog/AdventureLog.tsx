import { useEffect, useRef, useMemo } from "react";
import type { AdventureLogProps } from "./AdventureLog.types";
import { formatDateWithWeekday } from "@/utils/calendar.utils";
import { findNearestEntry, sortTimelineEntries } from "./AdventureLog.utils";
import styles from "./AdventureLog.module.scss";

export function AdventureLog({
  timeline,
  selectedDate,
  currentDate,
}: AdventureLogProps) {
  const entryRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Sort timeline entries (most recent first)
  const sortedTimeline = useMemo(
    () => sortTimelineEntries(timeline),
    [timeline]
  );

  // Find the nearest session entry to the selected date
  const nearestEntry = useMemo(() => {
    return findNearestEntry(timeline, selectedDate);
  }, [timeline, selectedDate]);

  // Scroll to nearest entry when selected date changes
  useEffect(() => {
    if (nearestEntry && entryRefs.current.has(nearestEntry.id)) {
      const element = entryRefs.current.get(nearestEntry.id);
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [nearestEntry]);

  if (sortedTimeline.length === 0) {
    return (
      <div className={styles.AdventureLog}>
        <h2 className={styles.Header}>Adventure Log</h2>
        <div className={styles.EmptyState}>
          No entries recorded yet. Your adventure awaits!
        </div>
      </div>
    );
  }

  const isCurrentDate =
    selectedDate.year === currentDate.year &&
    selectedDate.month === currentDate.month &&
    selectedDate.day === currentDate.day;

  return (
    <div className={styles.AdventureLog}>
      <h2 className={styles.Header}>Adventure Log</h2>

      <div className={styles.Content}>
        <div className={styles.Entries}>
          {sortedTimeline.map((entry) => {
            const isNearest = nearestEntry?.id === entry.id && !isCurrentDate;

            return (
              <div
                key={entry.id}
                ref={(el) => {
                  if (el) {
                    entryRefs.current.set(entry.id, el);
                  } else {
                    entryRefs.current.delete(entry.id);
                  }
                }}
                className={`${styles.Entry} ${
                  isNearest ? styles.Entry__Highlighted : ""
                }`}
              >
                <div className={styles.EntryHeader}>
                  {entry.sessionNumber && (
                    <div className={styles.SessionNumber}>
                      Session {entry.sessionNumber}
                    </div>
                  )}
                  <h3 className={styles.EntryTitle}>{entry.title}</h3>
                  <div className={styles.EntryDate}>
                    {formatDateWithWeekday(entry.date)}
                  </div>
                </div>

                {entry.description && (
                  <div className={styles.Description}>{entry.description}</div>
                )}

                {entry.summary && (
                  <div className={styles.Summary}>{entry.summary}</div>
                )}

                {entry.highlights && entry.highlights.length > 0 && (
                  <div className={styles.Section}>
                    <div className={styles.SectionTitle}>Highlights</div>
                    <ul className={styles.List}>
                      {entry.highlights.map(
                        (highlight: string, index: number) => (
                          <li key={index} className={styles.ListItem}>
                            {highlight}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {entry.npcsEncountered && entry.npcsEncountered.length > 0 && (
                  <div className={styles.Section}>
                    <div className={styles.SectionTitle}>NPCs Encountered</div>
                    <div className={styles.TagList}>
                      {entry.npcsEncountered.map(
                        (npc: string, index: number) => (
                          <span key={index} className={styles.Tag}>
                            {npc}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {entry.locationsVisited &&
                  entry.locationsVisited.length > 0 && (
                    <div className={styles.Section}>
                      <div className={styles.SectionTitle}>
                        Locations Visited
                      </div>
                      <div className={styles.TagList}>
                        {entry.locationsVisited.map(
                          (location: string, index: number) => (
                            <span key={index} className={styles.Tag}>
                              {location}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {entry.itemsAcquired && entry.itemsAcquired.length > 0 && (
                  <div className={styles.Section}>
                    <div className={styles.SectionTitle}>Items Acquired</div>
                    <div className={styles.TagList}>
                      {entry.itemsAcquired.map(
                        (item: string, index: number) => (
                          <span key={index} className={styles.Tag}>
                            {item}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
