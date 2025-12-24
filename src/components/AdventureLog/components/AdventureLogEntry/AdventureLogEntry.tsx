import { memo } from "react";
import { formatDateWithWeekday } from "@/utils/calendar.utils";
import type { AdventureLogEntryProps } from "./AdventureLogEntry.types";
import styles from "../../AdventureLog.module.scss";

export const AdventureLogEntry = memo(function AdventureLogEntry({
  entry,
  isNearest,
  entryRef,
}: AdventureLogEntryProps) {
  return (
    <div
      ref={entryRef}
      className={`${styles.Entry} ${
        isNearest ? styles.Entry__Highlighted : ""
      }`}
    >
      <div className={styles.EntryHeader}>
        <div className={styles.EntryTag}>
          {entry.type === "session" && `Session ${entry.sessionNumber}`}
          {entry.type === "event" && "Event"}
        </div>
        <h3 className={styles.EntryTitle}>{entry.title}</h3>
        <div className={styles.EntryDate}>
          {formatDateWithWeekday(entry.date)}
        </div>
      </div>

      {entry.description && (
        <div className={styles.Description}>{entry.description}</div>
      )}

      {entry.summary && <div className={styles.Summary}>{entry.summary}</div>}

      {entry.highlights && entry.highlights.length > 0 && (
        <div className={styles.Section}>
          <div className={styles.SectionTitle}>Highlights</div>
          <ul className={styles.List}>
            {entry.highlights.map((highlight: string, index: number) => (
              <li key={index} className={styles.ListItem}>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {entry.npcsEncountered && entry.npcsEncountered.length > 0 && (
        <div className={styles.Section}>
          <div className={styles.SectionTitle}>NPCs Encountered</div>
          <div className={styles.TagList}>
            {entry.npcsEncountered.map((npc: string, index: number) => (
              <span key={index} className={styles.Tag}>
                {npc}
              </span>
            ))}
          </div>
        </div>
      )}

      {entry.locationsVisited && entry.locationsVisited.length > 0 && (
        <div className={styles.Section}>
          <div className={styles.SectionTitle}>Locations Visited</div>
          <div className={styles.TagList}>
            {entry.locationsVisited.map((location: string, index: number) => (
              <span key={index} className={styles.Tag}>
                {location}
              </span>
            ))}
          </div>
        </div>
      )}

      {entry.itemsAcquired && entry.itemsAcquired.length > 0 && (
        <div className={styles.Section}>
          <div className={styles.SectionTitle}>Items Acquired</div>
          <div className={styles.TagList}>
            {entry.itemsAcquired.map((item: string, index: number) => (
              <span key={index} className={styles.Tag}>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
