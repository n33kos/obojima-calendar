export interface ErrorStateProps {
  title: string;
  message: string;
  errorDetails?: string;
  onRetry?: () => void;
}
