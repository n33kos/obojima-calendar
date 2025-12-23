import { useMemo } from 'react';
import type { CalendarProps } from './Calendar.types';
import { getMonthInfo, getMonthByNumber, generateMonthGridByWeeks, WEEKDAYS, isVeilDay } from '@/utils/calendar.utils';
import type { Month } from '@/types';
import styles from './Calendar.module.scss';

export function Calendar({
  currentDate,
  displayedMonth,
  displayedYear,
  selectedDate,
  events = [],
  onDateClick,
  onMonthChange,
  onYearChange,
}: CalendarProps) {
  const monthInfo = getMonthInfo(displayedMonth);
  const weeks = useMemo(() => generateMonthGridByWeeks(displayedMonth), [displayedMonth]);

  // Create a map of day -> events for quick lookup
  const eventsByDay = useMemo(() => {
    const map = new Map<number, typeof events>();
    events.forEach((event) => {
      if (event.date.month === displayedMonth && event.date.year === displayedYear) {
        const existing = map.get(event.date.day) || [];
        map.set(event.date.day, [...existing, event]);
      }
    });
    return map;
  }, [events, displayedMonth, displayedYear]);

  const handleDayClick = (day: number) => {
    onDateClick?.(day);
  };

  // Handle month navigation with year wraparound
  const handlePrevMonth = () => {
    const currentMonthNum = monthInfo?.number || 1;
    if (currentMonthNum === 1) {
      // Going back from Jan (1) wraps to Vell (13) of previous year
      const prevMonth = getMonthByNumber(13);
      if (prevMonth) {
        onMonthChange?.(prevMonth.name as Month);
        onYearChange?.(displayedYear - 1);
      }
    } else {
      const prevMonthNum = currentMonthNum - 1;
      const prevMonth = getMonthByNumber(prevMonthNum);
      if (prevMonth) {
        onMonthChange?.(prevMonth.name as Month);
      }
    }
  };

  const handleNextMonth = () => {
    const currentMonthNum = monthInfo?.number || 1;
    if (currentMonthNum === 13) {
      // Going forward from Vell (13) wraps to Jan (1) of next year
      const nextMonth = getMonthByNumber(1);
      if (nextMonth) {
        onMonthChange?.(nextMonth.name as Month);
        onYearChange?.(displayedYear + 1);
      }
    } else {
      const nextMonthNum = currentMonthNum + 1;
      const nextMonth = getMonthByNumber(nextMonthNum);
      if (nextMonth) {
        onMonthChange?.(nextMonth.name as Month);
      }
    }
  };

  if (isVeilDay(displayedMonth)) {
    const dayEvents = eventsByDay.get(1) || [];
    const hasEvent = dayEvents.length > 0;
    const hasImportantEvent = dayEvents.some((e) => e.isImportant);
    const isCurrentDay = currentDate.month === displayedMonth && currentDate.day === 1 && currentDate.year === displayedYear;
    const isSelectedDay = selectedDate?.month === displayedMonth && selectedDate?.day === 1 && selectedDate?.year === displayedYear;

    return (
      <div className={styles.Calendar}>
        <div className={styles.Header}>
          <div className={styles.MonthNavigation}>
            <button
              className={styles.NavButton}
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
              ‹
            </button>
            <div className={styles.MonthTitle}>
              <h2 className={styles.MonthName}>Veil Day</h2>
              <div className={styles.YearEra}>
                {currentDate.era} {displayedYear}
              </div>
            </div>
            <button
              className={styles.NavButton}
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              ›
            </button>
          </div>
          {monthInfo && <div className={styles.MonthNotes}>{monthInfo.notes}</div>}
        </div>
        <div className={styles.VeilDayContainer}>
          <button
            className={`${styles.VeilDayButton} ${isCurrentDay ? styles.VeilDayButton__IsCurrentDay : ''} ${
              isSelectedDay ? styles.VeilDayButton__IsSelectedDay : ''
            } ${hasEvent ? styles.VeilDayButton__HasEvent : ''} ${
              hasImportantEvent ? styles.VeilDayButton__HasImportantEvent : ''
            }`}
            onClick={() => handleDayClick(1)}
            aria-label={`Veil Day${isCurrentDay ? ' (current)' : ''}${
              isSelectedDay ? ' (selected)' : ''
            }${hasEvent ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''}`}
          >
            <div className={styles.VeilDayTitle}>Veil Day</div>
            <div className={styles.VeilDayDescription}>
              The between-day
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Calendar}>
      <div className={styles.Header}>
        <div className={styles.MonthNavigation}>
          <button
            className={styles.NavButton}
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            ‹
          </button>
          <div className={styles.MonthTitle}>
            <h2 className={styles.MonthName}>{monthInfo?.name}</h2>
            <div className={styles.YearEra}>
              {currentDate.era} {displayedYear}
            </div>
          </div>
          <button
            className={styles.NavButton}
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
        {monthInfo && <div className={styles.MonthNotes}>{monthInfo.notes}</div>}
      </div>

      <div className={styles.WeekdayHeader}>
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className={styles.WeekdayName}>
            {weekday.split(' ')[0]}
          </div>
        ))}
      </div>

      <div className={styles.Grid}>
        {weeks.flat().map((day) => {
          const dayEvents = eventsByDay.get(day) || [];
          const hasEvent = dayEvents.length > 0;
          const hasImportantEvent = dayEvents.some((e) => e.isImportant);
          const isCurrentDay =
            currentDate.month === displayedMonth && currentDate.day === day && currentDate.year === displayedYear;
          const isSelectedDay =
            selectedDate?.month === displayedMonth && selectedDate?.day === day && selectedDate?.year === displayedYear;

          return (
            <button
              key={day}
              className={`${styles.Day} ${isCurrentDay ? styles.Day__IsCurrentDay : ''} ${
                isSelectedDay ? styles.Day__IsSelectedDay : ''
              } ${hasEvent ? styles.Day__HasEvent : ''} ${
                hasImportantEvent ? styles.Day__HasImportantEvent : ''
              }`}
              onClick={() => handleDayClick(day)}
              aria-label={`Day ${day}${isCurrentDay ? ' (current)' : ''}${
                isSelectedDay ? ' (selected)' : ''
              }${hasEvent ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''}`}
            >
              <span className={styles.DayNumber}>{day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
