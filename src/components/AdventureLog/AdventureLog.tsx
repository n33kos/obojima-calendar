import { useEffect, useRef, useMemo } from 'react';
import type { AdventureLogProps } from './AdventureLog.types';
import { formatDateWithWeekday } from '@/utils/calendar.utils';
import { findNearestEntry, filterEventsByDate } from './AdventureLog.utils';
import styles from './AdventureLog.module.scss';

export function AdventureLog({ entries, events, selectedDate, currentDate }: AdventureLogProps) {
  const entryRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Sort entries by session number descending (most recent first)
  const sortedEntries = [...entries].sort((a, b) => b.sessionNumber - a.sessionNumber);

  // Find the nearest entry to the selected date
  const nearestEntry = useMemo(() => {
    return findNearestEntry(entries, selectedDate);
  }, [entries, selectedDate]);

  // Filter events for the selected date
  const dateEvents = useMemo(() => {
    return filterEventsByDate(events, selectedDate);
  }, [events, selectedDate]);

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
      </h2>
      
      <div className={styles.content}>
        {dateEvents.length > 0 && (
          <div className={styles.eventsSection}>
            <h3 className={styles.eventsSectionTitle}>
              Events on {formatDateWithWeekday(selectedDate)}
            </h3>
            <div className={styles.eventsList}>
              {dateEvents.map((event) => (
                <div
                  key={event.id}
                  className={`${styles.event} ${event.isImportant ? styles.importantEvent : ''}`}
                >
                  <div className={styles.eventHeader}>
                    <h4 className={styles.eventTitle}>{event.title}</h4>
                    {event.isImportant && (
                      <span className={styles.importantBadge}>Important</span>
                    )}
                  </div>
                  {event.description && (
                    <p className={styles.eventDescription}>{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
    </div>
  );
}
