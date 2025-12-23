import type { ErrorStateProps } from './ErrorState.types';
import styles from './ErrorState.module.scss';

export function ErrorState({ title, message, errorDetails, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.Error}>
      <h2 className={styles.ErrorTitle}>{title}</h2>
      <p className={styles.ErrorMessage}>{message}</p>
      {errorDetails && (
        <details>
          <summary>Error Details</summary>
          <div className={styles.ErrorDetails}>{errorDetails}</div>
        </details>
      )}
      {onRetry && (
        <button className={styles.RetryButton} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
