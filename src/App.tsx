import { useCalendarData } from './hooks/useCalendarData';
import { Calendar } from './components/Calendar/Calendar';
import { TimeOfDay } from './components/TimeOfDay/TimeOfDay';
import { AdventureLog } from './components/AdventureLog/AdventureLog';
import { formatDateWithWeekday } from './utils/calendar.utils';
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

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Obojima Party Tracker</h1>
          <p className={styles.subtitle}>Adventure Chronicle & Calendar</p>
          <div className={styles.currentDate}>
            {formatDateWithWeekday(data.date)}
          </div>
        </header>

        <div className={styles.grid}>
          <div className={styles.leftColumn}>
            <Calendar
              currentDate={data.date}
              events={data.events}
              onDateClick={(day) => console.log('Clicked day:', day)}
            />
          </div>

          <div className={styles.rightColumn}>
            <TimeOfDay time={data.time} />
            <AdventureLog entries={data.adventureLog || []} />
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
