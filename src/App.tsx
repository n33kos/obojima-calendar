import { useState, useMemo } from 'react';
import { useCalendarData } from './hooks/useCalendarData';
import { useBackgroundScale } from './hooks/useBackgroundScale';
import { Calendar } from './components/Calendar/Calendar';
import { CurrentDate } from './components/CurrentDate/CurrentDate';
import { TimeOfDay } from './components/TimeOfDay/TimeOfDay';
import { AdventureLog } from './components/AdventureLog/AdventureLog';
import { createHandleDayClick, createHandleReturnToToday } from './App.utils';
import type { Month, CalendarDate } from './types';
import styles from './App.module.scss';

// Configuration - Update these with your Gist details
const GIST_CONFIG = {
  username: 'n33kos',
  gistId: 'c0f12ac026aae6e7681c4a1d4385ba62',
  filename: 'obojima-party-tracker.json',
  refreshInterval: 60000, // Refresh every 60 seconds (optional)
};

// Background image dimensions (original size)
const BACKGROUND_IMAGE_WIDTH = 1536;
const BACKGROUND_IMAGE_HEIGHT = 1024;

function App() {
  const { data, loading, error, refetch } = useCalendarData(GIST_CONFIG);

  // Calculate scale factor to match background image
  const backgroundScale = useBackgroundScale(BACKGROUND_IMAGE_WIDTH, BACKGROUND_IMAGE_HEIGHT);

  // State for selected date and displayed month - must be declared before any conditional returns
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [displayedMonth, setDisplayedMonth] = useState<Month | null>(null);

  // Check if viewing current month/day - must be declared before conditional returns
  const isViewingToday = useMemo(() => {
    return !selectedDate && !displayedMonth;
  }, [selectedDate, displayedMonth]);

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
  const handleDayClick = createHandleDayClick(data.date, currentMonth, setSelectedDate);

  // Handler to return to current date
  const handleReturnToToday = createHandleReturnToToday(setSelectedDate, setDisplayedMonth);

  return (
    <div className={styles.app}>
      <img src="/background.png" alt="scribe's desk background" className={styles.backgroundImage} />

      <div className={styles.container} style={{ transform: `scale(${backgroundScale}) rotate3d(1, 0, 0, 10deg)` }}>
        <div className={styles.contentOverlay}>
          {!isViewingToday && (
            <button className={styles.todayButton} onClick={handleReturnToToday}>
              Return to Today
            </button>
          )}

          <CurrentDate date={data.date} time={data.time} />

          <TimeOfDay time={data.time} />
          
          <Calendar
            currentDate={data.date}
            displayedMonth={currentMonth}
            selectedDate={selectedDate}
            events={data.events}
            onDateClick={handleDayClick}
            onMonthChange={setDisplayedMonth}
          />

          <AdventureLog
            entries={data.adventureLog || []}
            events={data.events || []}
            selectedDate={selectedDate || data.date}
            currentDate={data.date}
          />
        </div>
        
      </div>
      
    </div>
  );
}

export default App;
