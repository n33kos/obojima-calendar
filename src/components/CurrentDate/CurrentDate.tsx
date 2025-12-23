import type { CurrentDateProps } from './CurrentDate.types';
import { formatDateWithWeekday, formatTime, bellKnotTo12Hour } from '@/utils/calendar.utils';
import styles from './CurrentDate.module.scss';

export function CurrentDate({ date, time, isViewingToday = true, onReturnToToday }: CurrentDateProps) {
  const twelveHourTime = bellKnotTo12Hour(time.bell, time.knot);

  return (
    <div className={styles.CurrentDate}>
      {!isViewingToday && onReturnToToday && (
        <button className={styles.TodayButton} onClick={onReturnToToday}>
          Return to Today
        </button>
      )}
      <div className={styles.DateDisplay}>
        {formatDateWithWeekday(date)}
      </div>
      <div className={styles.TimeDisplay}>
        <span className={styles.BellTime}>Bell {formatTime(time.bell, time.knot)}</span>
        <span className={styles.Separator}>•</span>
        <span className={styles.TwelveHourTime}>{twelveHourTime}</span>
      </div>
    </div>
  );
}
