import { useEffect, useRef, useMemo } from "react";
import type { AdventureLogProps } from "./AdventureLog.types";
import { findNearestEntry, sortTimelineEntries } from "./AdventureLog.utils";
import { AdventureLogEntry } from "./components/AdventureLogEntry";
import styles from "./AdventureLog.module.scss";

export function AdventureLog({
  timeline,
  selectedDate,
  selectedEntryId,
  currentDate,
}: AdventureLogProps) {
  const entryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const contentRef = useRef<HTMLDivElement>(null);

  // Sort timeline entries (most recent first)
  const sortedTimeline = useMemo(
    () => sortTimelineEntries(timeline),
    [timeline]
  );

  // Find the target entry - use selectedEntryId if provided, otherwise find nearest
  const targetEntry = useMemo(() => {
    if (selectedEntryId) {
      return timeline.find((entry) => entry.id === selectedEntryId) || null;
    }
    return findNearestEntry(timeline, selectedDate);
  }, [timeline, selectedDate, selectedEntryId]);

  // Scroll to target entry when selection changes
  useEffect(() => {
    if (targetEntry && contentRef.current) {
      const element = entryRefs.current.get(targetEntry.id);
      if (element) {
        const container = contentRef.current;
        const elementTop = element.offsetTop;
        const offset = 16; // Add some padding from the top

        // Scroll the container to position the element near the top
        container.scrollTo({
          top: elementTop - offset,
          behavior: "smooth",
        });
      }
    }
  }, [targetEntry]);

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

      <div ref={contentRef} className={styles.Content}>
        <div className={styles.Entries}>
          {sortedTimeline.map((entry) => {
            const isNearest = targetEntry?.id === entry.id && !isCurrentDate;

            return (
              <AdventureLogEntry
                key={entry.id}
                entry={entry}
                isNearest={isNearest}
                entryRef={(el) => {
                  if (el) {
                    entryRefs.current.set(entry.id, el);
                  } else {
                    entryRefs.current.delete(entry.id);
                  }
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
