import { useMemo } from 'react';
import type { CalendarProps } from './Calendar.types';
import { getMonthInfo, getMonthByNumber, generateMonthGridByWeeks, WEEKDAYS, isVeilDay } from '@/utils/calendar.utils';
import type { Month } from '@/types';
import styles from './Calendar.module.scss';

export function Calendar({
  currentDate,
  displayedMonth,
  selectedDate,
  events = [],
  onDateClick,
  onMonthChange,
}: CalendarProps) {
  const monthInfo = getMonthInfo(displayedMonth);
  const weeks = useMemo(() => generateMonthGridByWeeks(), []);

  // Create a map of day -> events for quick lookup
  const eventsByDay = useMemo(() => {
    const map = new Map<number, typeof events>();
    events.forEach((event) => {
      if (event.date.month === displayedMonth && event.date.year === currentDate.year) {
        const existing = map.get(event.date.day) || [];
        map.set(event.date.day, [...existing, event]);
      }
    });
    return map;
  }, [events, displayedMonth, currentDate.year]);

  const handleDayClick = (day: number) => {
    onDateClick?.(day);
  };

  // Handle month navigation
  const handlePrevMonth = () => {
    const currentMonthNum = monthInfo?.number || 1;
    const prevMonthNum = currentMonthNum === 1 ? 13 : currentMonthNum - 1;
    const prevMonth = getMonthByNumber(prevMonthNum);
    if (prevMonth) {
      onMonthChange?.(prevMonth.name as Month);
    }
  };

  const handleNextMonth = () => {
    const currentMonthNum = monthInfo?.number || 1;
    const nextMonthNum = currentMonthNum === 13 ? 1 : currentMonthNum + 1;
    const nextMonth = getMonthByNumber(nextMonthNum);
    if (nextMonth) {
      onMonthChange?.(nextMonth.name as Month);
    }
  };

  if (isVeilDay(displayedMonth)) {
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
        <div className={styles.monthNavigation}>
          <button
            className={styles.navButton}
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            ‹
          </button>
          <div className={styles.monthTitle}>
            <h2 className={styles.monthName}>{monthInfo?.name}</h2>
            <div className={styles.yearEra}>
              {currentDate.era} {currentDate.year}
            </div>
          </div>
          <button
            className={styles.navButton}
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            ›
          </button>
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
          const isCurrentDay =
            currentDate.month === displayedMonth && currentDate.day === day;
          const isSelectedDay =
            selectedDate?.month === displayedMonth && selectedDate?.day === day;

          return (
            <button
              key={day}
              className={`${styles.day} ${isCurrentDay ? styles.isCurrentDay : ''} ${
                isSelectedDay ? styles.isSelectedDay : ''
              } ${hasEvent ? styles.hasEvent : ''} ${
                hasImportantEvent ? styles.hasImportantEvent : ''
              }`}
              onClick={() => handleDayClick(day)}
              aria-label={`Day ${day}${isCurrentDay ? ' (current)' : ''}${
                isSelectedDay ? ' (selected)' : ''
              }${hasEvent ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''}`}
            >
              <span className={styles.dayNumber}>{day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
