import styles from "./Skeleton.module.css";

export const SkeletonLine = ({ width = "100%", height = "14px" }) => (
  <span className={styles.line} style={{ width, height }} />
);

export const SkeletonCard = ({ lines = 3 }) => (
  <div className={styles.card}>
    <SkeletonLine width="60%" height="18px" />
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonLine key={i} width={`${85 - i * 10}%`} />
    ))}
  </div>
);

export const SkeletonChart = ({ height = 280 }) => (
  <div className={styles.card}>
    <SkeletonLine width="40%" height="16px" />
    <div className={styles.chartBlock} style={{ height }} />
  </div>
);

export const SkeletonGrid = ({ count = 3, lines = 3 }) => (
  <div className={styles.grid}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} lines={lines} />
    ))}
  </div>
);

export const SkeletonRow = () => (
  <div className={styles.row}>
    <SkeletonLine width="40%" />
    <SkeletonLine width="20%" />
  </div>
);

export const LoadingBanner = ({ text = "Loading…" }) => (
  <div className={styles.banner}>
    <span className={styles.spinner} aria-hidden="true" />
    <span>{text}</span>
  </div>
);