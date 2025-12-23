import { useMemo } from 'react';
import type { CalendarProps } from './Calendar.types';
import { getMonthInfo, generateMonthGridByWeeks, WEEKDAYS, isVeilDay } from '@/utils/calendar.utils';
import styles from './Calendar.module.scss';

export function Calendar({ currentDate, events = [], onDateClick }: CalendarProps) {
  const monthInfo = getMonthInfo(currentDate.month as any);
  const weeks = useMemo(() => generateMonthGridByWeeks(), []);

  // Create a map of day -> events for quick lookup
  const eventsByDay = useMemo(() => {
    const map = new Map<number, typeof events>();
    events.forEach((event) => {
      if (event.date.month === currentDate.month && event.date.year === currentDate.year) {
        const existing = map.get(event.date.day) || [];
        map.set(event.date.day, [...existing, event]);
      }
    });
    return map;
  }, [events, currentDate.month, currentDate.year]);

  const handleDayClick = (day: number) => {
    onDateClick?.(day);
  };

  if (isVeilDay(currentDate.month)) {
    return (
      <div className={styles.calendar}>
        <div className={styles.header}>
          <h2 className={styles.monthName}>Veil Day</h2>
          <div className={styles.yearEra}>
            {currentDate.era} {currentDate.year}
          </div>
        </div>
        <div className={styles.veilDay}>
          <div className={styles.veilDayTitle}>Veil Day</div>
          <div className={styles.veilDayDescription}>
            The between-day. A time for festivals, reflection, and closing of the year.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <h2 className={styles.monthName}>{monthInfo?.name}</h2>
        <div className={styles.yearEra}>
          {currentDate.era} {currentDate.year}
        </div>
        {monthInfo && <div className={styles.monthNotes}>{monthInfo.notes}</div>}
      </div>

      <div className={styles.weekdayHeader}>
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className={styles.weekdayName}>
            {weekday.split(' ')[0]}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {weeks.flat().map((day) => {
          const dayEvents = eventsByDay.get(day) || [];
          const hasEvent = dayEvents.length > 0;
          const hasImportantEvent = dayEvents.some((e) => e.isImportant);
          const isCurrentDay = currentDate.day === day;

          return (
            <button
              key={day}
              className={`${styles.day} ${isCurrentDay ? styles.isCurrentDay : ''} ${
                hasEvent ? styles.hasEvent : ''
              } ${hasImportantEvent ? styles.hasImportantEvent : ''}`}
              onClick={() => handleDayClick(day)}
              aria-label={`Day ${day}${isCurrentDay ? ' (current)' : ''}${
                hasEvent ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''
              }`}
            >
              <span className={styles.dayNumber}>{day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
