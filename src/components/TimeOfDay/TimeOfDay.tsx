import type { TimeOfDayProps } from './TimeOfDay.types';
import { BELLS_PER_DAY, KNOTS_PER_BELL, bellKnotTo12Hour } from '@/utils/calendar.utils';
import styles from './TimeOfDay.module.scss';

const BELL_DESCRIPTIONS = [
  'Dawn - The world awakens',
  'Morning - Markets open',
  'Midmorning - Work begins in earnest',
  'Noon - The sun reaches its peak',
  'Afternoon - Heat of the day',
  'Evening - Work winds down',
  'Dusk - Lanterns are lit',
  'Night - Time for rest and stories',
];

export function TimeOfDay({ time }: TimeOfDayProps) {
  const { bell, knot } = time;
  const description = BELL_DESCRIPTIONS[bell - 1] || 'Unknown time';
  const twelveHourTime = bellKnotTo12Hour(bell, knot);

  return (
    <div className={styles.timeOfDay}>
      <div className={styles.header}>Current Time</div>

      <div className={styles.timeDisplay}>
        <div className={styles.bellDisplay}>
          <div className={styles.label}>Bell</div>
          <div className={styles.value}>{bell}</div>
        </div>

        <div className={styles.separator}>:</div>

        <div className={styles.knotDisplay}>
          <div className={styles.label}>Knot</div>
          <div className={styles.value}>{knot}</div>
        </div>
      </div>

      <div className={styles.twelveHour}>{twelveHourTime}</div>

      <div className={styles.description}>{description}</div>

      <div className={styles.bellIndicators}>
        {Array.from({ length: BELLS_PER_DAY }, (_, i) => (
          <div
            key={i}
            className={`${styles.bellIndicator} ${i + 1 <= bell ? styles.active : ''}`}
            aria-label={`Bell ${i + 1}${i + 1 === bell ? ' (current)' : ''}`}
          />
        ))}
      </div>

      <div className={styles.knotIndicators}>
        {Array.from({ length: KNOTS_PER_BELL }, (_, i) => (
          <div
            key={i}
            className={`${styles.knotIndicator} ${i <= knot ? styles.active : ''}`}
            aria-label={`Knot ${i}${i === knot ? ' (current)' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
