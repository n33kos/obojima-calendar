export interface DataConfig {
  /** URL to fetch JSON data from */
  dataUrl: string;
  refreshInterval: number;
}

/**
 * Loads data configuration from environment variables
 */
export function getDataConfig(): DataConfig {
  return {
    dataUrl: import.meta.env.VITE_CALENDAR_DATA_URL || "",
    refreshInterval:
      Number(import.meta.env.VITE_CALENDAR_REFRESH_INTERVAL) || 1200000,
  };
}
