import type { CurrentDateProps } from './CurrentDate.types';
import { formatDateWithWeekday, formatTime, bellKnotTo12Hour } from '@/utils/calendar.utils';
import styles from './CurrentDate.module.scss';

export function CurrentDate({ date, time }: CurrentDateProps) {
  const twelveHourTime = bellKnotTo12Hour(time.bell, time.knot);

  return (
    <div className={styles.currentDate}>
      <div className={styles.dateDisplay}>
        {formatDateWithWeekday(date)}
      </div>
      <div className={styles.timeDisplay}>
        <span className={styles.bellTime}>Bell {formatTime(time.bell, time.knot)}</span>
        <span className={styles.separator}>•</span>
        <span className={styles.twelveHourTime}>{twelveHourTime}</span>
      </div>
    </div>
  );
}
