import styles from './LoadingState.module.scss';

export function LoadingState() {
  return (
    <div className={styles.Loading}>
      <div className={styles.Spinner} aria-label="Loading" />
      <div className={styles.LoadingText}>Loading party tracker...</div>
    </div>
  );
}
