import { useState, useMemo } from 'react';
import { useCalendarData } from './hooks/useCalendarData';
import { Calendar } from './components/Calendar/Calendar';
import { TimeOfDay } from './components/TimeOfDay/TimeOfDay';
import { AdventureLog } from './components/AdventureLog/AdventureLog';
import { formatDateWithWeekday, formatTime } from './utils/calendar.utils';
import type { Month, CalendarDate } from './types';
import styles from './App.module.scss';

// Configuration - Update these with your Gist details
const GIST_CONFIG = {
  username: 'YOUR_GITHUB_USERNAME',
  gistId: 'YOUR_GIST_ID',
  filename: 'obojima-party-tracker.json',
  refreshInterval: 60000, // Refresh every 60 seconds (optional)
};

function App() {
  const { data, loading, error, refetch } = useCalendarData(GIST_CONFIG);

  // State for selected date and displayed month
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [displayedMonth, setDisplayedMonth] = useState<Month | null>(null);

  if (loading) {
    return (
      <div className={styles.app}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner} aria-label="Loading" />
            <div className={styles.loadingText}>Loading party tracker...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2 className={styles.errorTitle}>Failed to Load Data</h2>
            <p className={styles.errorMessage}>
              Unable to fetch calendar data from GitHub Gist.
            </p>
            <details>
              <summary>Error Details</summary>
              <div className={styles.errorDetails}>{error.message}</div>
            </details>
            <button className={styles.retryButton} onClick={refetch}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.app}>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2 className={styles.errorTitle}>No Data Available</h2>
            <p className={styles.errorMessage}>
              Please configure your GitHub Gist in src/App.tsx
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Initialize displayed month to current month on first load
  const currentMonth = displayedMonth || (data.date.month === 'Veil' ? 'Vell' : data.date.month as Month);

  // Handler for day click
  const handleDayClick = (day: number) => {
    setSelectedDate({
      ...data.date,
      month: currentMonth,
      day,
      weekday: data.date.weekday, // Will be recalculated by getWeekday
    });
  };

  // Handler to return to current date
  const handleReturnToToday = () => {
    setSelectedDate(null);
    setDisplayedMonth(null);
  };

  // Check if viewing current month/day
  const isViewingToday = useMemo(() => {
    return !selectedDate && !displayedMonth;
  }, [selectedDate, displayedMonth]);

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.currentDate}>
            <div>
              {formatDateWithWeekday(data.date)}
            </div>
            <div>
              Bell {formatTime(data.time.bell, data.time.knot)}
            </div>
          </div>
          {!isViewingToday && (
            <button className={styles.todayButton} onClick={handleReturnToToday}>
              Return to Today
            </button>
          )}
        </header>

        <div className={styles.grid}>
          <div className={styles.leftColumn}>
            <Calendar
              currentDate={data.date}
              displayedMonth={currentMonth}
              selectedDate={selectedDate}
              events={data.events}
              onDateClick={handleDayClick}
              onMonthChange={setDisplayedMonth}
            />
          </div>

          <div className={styles.rightColumn}>
            <TimeOfDay time={data.time} />
            <AdventureLog
              entries={data.adventureLog || []}
              selectedDate={selectedDate || data.date}
              currentDate={data.date}
            />
          </div>
        </div>

        <footer className={styles.footer}>
          <p>Obojima Party Tracker - A D&D Campaign Companion</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
