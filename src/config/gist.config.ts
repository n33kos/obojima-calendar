export interface GistConfig {
  username: string;
  gistId: string;
  filename: string;
  refreshInterval: number;
}

/**
 * Loads GIST configuration from environment variables
 */
export function getGistConfig(): GistConfig {
  return {
    username: import.meta.env.VITE_GIST_USERNAME || "",
    gistId: import.meta.env.VITE_GIST_ID || "",
    filename: import.meta.env.VITE_GIST_FILENAME || "obojima-party-tracker.json",
    refreshInterval: Number(import.meta.env.VITE_GIST_REFRESH_INTERVAL) || 60000,
  };
}
