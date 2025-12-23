import { useEffect, useRef, useMemo } from 'react';
import type { AdventureLogProps } from './AdventureLog.types';
import { formatDateWithWeekday, getMonthInfo } from '@/utils/calendar.utils';
import styles from './AdventureLog.module.scss';

export function AdventureLog({ entries, selectedDate, currentDate }: AdventureLogProps) {
  const entryRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Sort entries by session number descending (most recent first)
  const sortedEntries = [...entries].sort((a, b) => b.sessionNumber - a.sessionNumber);

  // Find the nearest entry to the selected date
  const nearestEntry = useMemo(() => {
    if (entries.length === 0) return null;

    // Convert date to a comparable number (year * 10000 + monthNum * 100 + day)
    const dateToNumber = (date: typeof selectedDate) => {
      const monthInfo = getMonthInfo(date.month as any);
      const monthNum = monthInfo?.number || 0;
      return date.year * 10000 + monthNum * 100 + date.day;
    };

    const selectedNum = dateToNumber(selectedDate);

    // Find entries on or before the selected date
    const pastEntries = entries.filter((entry) => {
      const entryNum = dateToNumber(entry.date);
      return entryNum <= selectedNum;
    });

    // Return the most recent past entry (highest session number)
    if (pastEntries.length > 0) {
      return pastEntries.reduce((latest, current) =>
        current.sessionNumber > latest.sessionNumber ? current : latest
      );
    }

    // If no past entries, return the oldest entry
    return entries.reduce((oldest, current) =>
      current.sessionNumber < oldest.sessionNumber ? current : oldest
    );
  }, [entries, selectedDate]);

  // Scroll to nearest entry when selected date changes
  useEffect(() => {
    if (nearestEntry && entryRefs.current.has(nearestEntry.id)) {
      const element = entryRefs.current.get(nearestEntry.id);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [nearestEntry]);

  if (entries.length === 0) {
    return (
      <div className={styles.adventureLog}>
        <h2 className={styles.header}>Adventure Log</h2>
        <div className={styles.emptyState}>
          No sessions recorded yet. Your adventure awaits!
        </div>
      </div>
    );
  }

  const isCurrentDate =
    selectedDate.year === currentDate.year &&
    selectedDate.month === currentDate.month &&
    selectedDate.day === currentDate.day;

  return (
    <div className={styles.adventureLog}>
      <h2 className={styles.header}>
        Adventure Log
        {!isCurrentDate && nearestEntry && (
          <div className={styles.headerSubtitle}>
            Showing nearest entry to selected date
          </div>
        )}
      </h2>

      <div className={styles.entries}>
        {sortedEntries.map((entry) => {
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
              className={`${styles.entry} ${isNearest ? styles.highlighted : ''}`}
            >
            <div className={styles.entryHeader}>
              <div className={styles.sessionNumber}>Session {entry.sessionNumber}</div>
              <h3 className={styles.entryTitle}>{entry.title}</h3>
              <div className={styles.entryDate}>{formatDateWithWeekday(entry.date)}</div>
            </div>

            <div className={styles.summary}>{entry.summary}</div>

            {entry.highlights && entry.highlights.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Highlights</div>
                <ul className={styles.list}>
                  {entry.highlights.map((highlight, index) => (
                    <li key={index} className={styles.listItem}>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {entry.npcsEncountered && entry.npcsEncountered.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>NPCs Encountered</div>
                <div className={styles.tagList}>
                  {entry.npcsEncountered.map((npc, index) => (
                    <span key={index} className={styles.tag}>
                      {npc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.locationsVisited && entry.locationsVisited.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Locations Visited</div>
                <div className={styles.tagList}>
                  {entry.locationsVisited.map((location, index) => (
                    <span key={index} className={styles.tag}>
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.itemsAcquired && entry.itemsAcquired.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Items Acquired</div>
                <div className={styles.tagList}>
                  {entry.itemsAcquired.map((item, index) => (
                    <span key={index} className={styles.tag}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
