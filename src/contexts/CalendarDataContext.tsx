import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import { useCalendarData } from "../hooks/useCalendarData";
import { getGistConfig } from "../config/gist.config";
import {
  createHandleDayClick,
  createHandleReturnToToday,
} from "../components/App/App.utils";
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

  // State for selected date and displayed month
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [displayedMonth, setDisplayedMonth] = useState<Month | null>(null);

  // Check if viewing current month/day
  const isViewingToday = useMemo(() => {
    return !selectedDate && !displayedMonth;
  }, [selectedDate, displayedMonth]);

  // Initialize displayed month to current month on first load
  const currentMonth = useMemo(() => {
    if (!data) return null;
    return (
      displayedMonth ||
      (data.date.month === "Veil" ? "Vell" : (data.date.month as Month))
    );
  }, [data, displayedMonth]);

  // Handler for day click
  const handleDayClick = useMemo(() => {
    if (!data || !currentMonth) return undefined;
    return createHandleDayClick(data.date, currentMonth, setSelectedDate);
  }, [data, currentMonth]);

  // Handler to return to current date
  const handleReturnToToday = useMemo(() => {
    return createHandleReturnToToday(setSelectedDate, setDisplayedMonth);
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
    isViewingToday,
    currentMonth,
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
