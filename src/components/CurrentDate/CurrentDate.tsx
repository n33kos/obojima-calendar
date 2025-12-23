import type { CurrentDateProps } from './CurrentDate.types';
import { formatDateWithWeekday, formatTime, bellKnotTo12Hour } from '@/utils/calendar.utils';
import styles from './CurrentDate.module.scss';

export function CurrentDate({ date, time, onReturnToToday }: CurrentDateProps) {
  const twelveHourTime = bellKnotTo12Hour(time.bell, time.knot);

  return (
    <button
      className={styles.CurrentDate}
      onClick={onReturnToToday}
      type="button"
      aria-label="Return to current date"
    >
      <div className={styles.DateDisplay}>
        {formatDateWithWeekday(date)}
      </div>
      <div className={styles.TimeDisplay}>
        <span className={styles.BellTime}>Bell {formatTime(time.bell, time.knot)}</span>
        <span className={styles.Separator}>•</span>
        <span className={styles.TwelveHourTime}>{twelveHourTime}</span>
      </div>
    </button>
  );
}
