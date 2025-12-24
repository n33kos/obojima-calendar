import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import { useCalendarData } from "../hooks/useCalendarData";
import { getGistConfig } from "../config/gist.config";
import { createHandleDayClick } from "../components/App/App.utils";
import type { CalendarDate, Month } from "../types";
import type { CalendarDataContextValue } from "./CalendarDataContext.types";

const CalendarDataContext = createContext<CalendarDataContextValue | null>(
  null
);

export interface CalendarDataProviderProps {
  children: ReactNode;
}

export function CalendarDataProvider({ children }: CalendarDataProviderProps) {
  const gistConfig = getGistConfig();
  const { data, loading, error, refetch } = useCalendarData(gistConfig);

  // State for selected date, displayed month, and displayed year
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [displayedMonth, setDisplayedMonth] = useState<Month | null>(null);
  const [displayedYear, setDisplayedYear] = useState<number | null>(null);

  // Check if viewing current month/day/year
  const isViewingToday = useMemo(() => {
    return !selectedDate && !displayedMonth && !displayedYear;
  }, [selectedDate, displayedMonth, displayedYear]);

  // Initialize displayed month to current month on first load
  const currentMonth = useMemo(() => {
    if (!data) return null;
    return displayedMonth || data.date.month;
  }, [data, displayedMonth]);

  // Initialize displayed year to current year on first load
  const currentYear = useMemo(() => {
    if (!data) return null;
    return displayedYear || data.date.year;
  }, [data, displayedYear]);

  // Handler for day click
  const handleDayClick = useMemo(() => {
    if (!data || !currentMonth) return undefined;
    return createHandleDayClick(
      data.date,
      currentMonth,
      setSelectedDate,
      setDisplayedMonth
    );
  }, [data, currentMonth]);

  // Handler to return to current date
  const handleReturnToToday = useMemo(() => {
    return () => {
      setSelectedDate(null);
      setDisplayedMonth(null);
      setDisplayedYear(null);
    };
  }, []);

  const value: CalendarDataContextValue = {
    data,
    loading,
    error,
    refetch,
    selectedDate,
    setSelectedDate,
    displayedMonth,
    setDisplayedMonth,
    displayedYear,
    setDisplayedYear,
    isViewingToday,
    currentMonth,
    currentYear,
    handleDayClick,
    handleReturnToToday,
  };

  return (
    <CalendarDataContext.Provider value={value}>
      {children}
    </CalendarDataContext.Provider>
  );
}

export function useCalendarDataContext(): CalendarDataContextValue {
  const context = useContext(CalendarDataContext);
  if (!context) {
    throw new Error(
      "useCalendarDataContext must be used within a CalendarDataProvider"
    );
  }
  return context;
}
