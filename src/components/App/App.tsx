import { useBackgroundScale } from "../../hooks/useBackgroundScale";
import { useCalendarDataContext } from "../../contexts/CalendarDataContext";
import { Calendar } from "../Calendar/Calendar";
import { CurrentDate } from "../CurrentDate/CurrentDate";
import { AdventureLog } from "../AdventureLog/AdventureLog";
import { LoadingState } from "../LoadingState/LoadingState";
import { ErrorState } from "../ErrorState/ErrorState";
import styles from "./App.module.scss";

function App() {
  const {
    data,
    loading,
    error,
    refetch,
    selectedDate,
    currentMonth,
    currentYear,
    handleDayClick,
    handleReturnToToday,
    setDisplayedMonth,
    setDisplayedYear,
  } = useCalendarDataContext();

  const backgroundScale = useBackgroundScale();

  return (
    <div className={styles.App}>
      <div className={styles.Wrapper}>
        <img
          src="./background.png"
          alt="scribe's desk background"
          className={styles.BackgroundImage}
        />

        <div
          className={styles.PageContainer}
          style={{
            transform: `perspective(1200px) scale(${backgroundScale}) rotate3d(1, 0, 0, 8deg)`,
          }}
        >
          {loading && <LoadingState />}

          {error && (
            <ErrorState
              title="Failed to Load Data"
              message="Unable to fetch calendar data from GitHub Gist."
              errorDetails={error.message}
              onRetry={refetch}
            />
          )}

          {!loading && !error && !data && (
            <ErrorState
              title="No Data Available"
              message="Please configure your GitHub Gist in src/App.tsx"
            />
          )}

          {!loading && !error && data && currentMonth && currentYear && handleDayClick && (
            <>
              <Calendar
                currentDate={data.date}
                displayedMonth={currentMonth}
                displayedYear={currentYear}
                selectedDate={selectedDate}
                events={data.events}
                onDateClick={handleDayClick}
                onMonthChange={setDisplayedMonth}
                onYearChange={setDisplayedYear}
              />

              <div className={styles.Sidebar}>
                <CurrentDate
                  date={data.date}
                  time={data.time}
                  onReturnToToday={handleReturnToToday}
                />
                <AdventureLog
                  entries={data.adventureLog || []}
                  events={data.events || []}
                  selectedDate={selectedDate || data.date}
                  currentDate={data.date}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
