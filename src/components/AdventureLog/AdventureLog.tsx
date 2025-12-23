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
      <div className={styles.AdventureLog}>
        <h2 className={styles.Header}>Adventure Log</h2>
        <div className={styles.EmptyState}>
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
    <div className={styles.AdventureLog}>
      <h2 className={styles.Header}>
        Adventure Log
      </h2>

      <div className={styles.Content}>
        {dateEvents.length > 0 && (
          <div className={styles.EventsSection}>
            <h3 className={styles.EventsSectionTitle}>
              Events on {formatDateWithWeekday(selectedDate)}
            </h3>
            <div className={styles.EventsList}>
              {dateEvents.map((event) => (
                <div
                  key={event.id}
                  className={`${styles.Event} ${event.isImportant ? styles.ImportantEvent : ''}`}
                >
                  <div className={styles.EventHeader}>
                    <h4 className={styles.EventTitle}>{event.title}</h4>
                    {event.isImportant && (
                      <span className={styles.ImportantBadge}>Important</span>
                    )}
                  </div>
                  {event.description && (
                    <p className={styles.EventDescription}>{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.Entries}>
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
                className={`${styles.Entry} ${isNearest ? styles.highlighted : ''}`}
              >
              <div className={styles.EntryHeader}>
                <div className={styles.SessionNumber}>Session {entry.sessionNumber}</div>
                <h3 className={styles.EntryTitle}>{entry.title}</h3>
                <div className={styles.EntryDate}>{formatDateWithWeekday(entry.date)}</div>
              </div>

              <div className={styles.Summary}>{entry.summary}</div>

              {entry.highlights && entry.highlights.length > 0 && (
                <div className={styles.Section}>
                  <div className={styles.SectionTitle}>Highlights</div>
                  <ul className={styles.List}>
                    {entry.highlights.map((highlight, index) => (
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
                    {entry.npcsEncountered.map((npc, index) => (
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
                    {entry.locationsVisited.map((location, index) => (
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
                    {entry.itemsAcquired.map((item, index) => (
                      <span key={index} className={styles.Tag}>
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
