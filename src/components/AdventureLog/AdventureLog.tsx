import type { AdventureLogProps } from './AdventureLog.types';
import { formatDateWithWeekday } from '@/utils/calendar.utils';
import styles from './AdventureLog.module.scss';

export function AdventureLog({ entries }: AdventureLogProps) {
  // Sort entries by session number descending (most recent first)
  const sortedEntries = [...entries].sort((a, b) => b.sessionNumber - a.sessionNumber);

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

  return (
    <div className={styles.adventureLog}>
      <h2 className={styles.header}>Adventure Log</h2>

      <div className={styles.entries}>
        {sortedEntries.map((entry) => (
          <div key={entry.id} className={styles.entry}>
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
        ))}
      </div>
    </div>
  );
}
