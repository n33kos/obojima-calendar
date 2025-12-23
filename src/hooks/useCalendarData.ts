import { useState, useEffect } from 'react';
import type { CurrentState } from '@/types';
import { fetchGistData, transformGistData } from '@/utils/gist.utils';

interface UseCalendarDataOptions {
  username: string;
  gistId: string;
  filename?: string;
  refreshInterval?: number; // milliseconds
}

interface UseCalendarDataReturn {
  data: CurrentState | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage calendar data from GitHub Gist
 */
export function useCalendarData({
  username,
  gistId,
  filename = 'obojima-calendar.json',
  refreshInterval,
}: UseCalendarDataOptions): UseCalendarDataReturn {
  const [data, setData] = useState<CurrentState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const gistData = await fetchGistData(username, gistId, filename);
      const transformedData = transformGistData(gistData);
      setData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch calendar data'));
      console.error('Error fetching calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up auto-refresh if interval provided
    if (refreshInterval && refreshInterval > 0) {
      const intervalId = setInterval(fetchData, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [username, gistId, filename, refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
