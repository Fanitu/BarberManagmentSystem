import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getRevenueHistory } from "../api/revenue";
import styles from "./RevenueView.module.css";

const PERIODS = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

const DEFAULT_LIMITS = { daily: 14, weekly: 8, monthly: 6 };
const LOAD_MORE_STEP = { daily: 7, weekly: 4, monthly: 3 };

const formatMoney = (n) =>
  (n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

// "Wednesday, 22 Jul 2026"
const formatDayLabel = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// "Mon, 20 Jul – Sun, 26 Jul 2026"
const formatRangeLabel = (startIso, endIso) => {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const startLabel = start.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const endLabel = end.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${startLabel} – ${endLabel}`;
};

const getEntryLabel = (period, entry) =>
  period === "daily"
    ? formatDayLabel(entry.start)
    : formatRangeLabel(entry.start, entry.end);

const RevenueView = () => {
  const { token } = useAuth();
  const [period, setPeriod] = useState("daily");
  const [limit, setLimit] = useState(DEFAULT_LIMITS.daily);
  const [entries, setEntries] = useState([]);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const changePeriod = (id) => {
    setPeriod(id);
    setLimit(DEFAULT_LIMITS[id]);
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    getRevenueHistory(token, period, limit)
      .then((data) => {
        console.log("Revenue data:", data.entries);
        setEntries(data.entries);
        setReachedEnd(data.reachedEnd);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, period, limit]);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Revenue</h2>

      <div className={styles.subtabs}>
        {PERIODS.map((p) => (
          <button
            key={p.id}
            className={`${styles.subtab} ${period === p.id ? styles.active : ""}`}
            onClick={() => changePeriod(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading && <p className={styles.hint}>Loading…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <div className={styles.list}>
          {entries.map((entry) => (
            <div key={entry.start} className={styles.entry}>
              <h3 className={styles.entryLabel}>{getEntryLabel(period, entry)}</h3>

              <div className={styles.grid}>
                <div className={styles.card}>
                  <span className={styles.cardLabel}>Total Revenue</span>
                  <span className={`${styles.cardValue} mono-figure`}>
                    {formatMoney(entry.totalRevenue)}
                  </span>
                </div>

                <div className={styles.card}>
                  <span className={styles.cardLabel}>Barbers Payment</span>
                  <span className={`${styles.cardValue} ${styles.negative} mono-figure`}>
                    {formatMoney(entry.barbersPayment)}
                  </span>
                </div>

                <div className={styles.card}>
                  <span className={styles.cardLabel}>Running-cost</span>
                  <span className={`${styles.cardValue} ${styles.negative} mono-figure`}>
                    {formatMoney(entry.runningCost)}
                  </span>
                </div>

                {period === "monthly" && (
                  <div className={styles.card}>
                    <span className={styles.cardLabel}>Monthly Expense</span>
                    <span className={`${styles.cardValue} ${styles.negative} mono-figure`}>
                      {formatMoney(entry.monthlyExpense)}
                    </span>
                  </div>
                )}

                <div className={`${styles.card} ${styles.highlight}`}>
                  <span className={styles.cardLabel}>Total Income</span>
                  <span className={`${styles.cardValue} ${styles.positive} mono-figure`}>
                    {formatMoney(entry.totalIncome)}
                  </span>
                </div>

                {period === "monthly" && (
                  <div className={`${styles.card} ${styles.highlight}`}>
                    <span className={styles.cardLabel}>Profit</span>
                    <span className={entry.profit >= 0 ? `${styles.cardValue} ${styles.positive} mono-figure` : `${styles.cardValue} ${styles.negative} mono-figure`}>
                      {formatMoney(entry.profit)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {entries.length === 0 && (<p className={styles.hint}>Not active recorded for this period</p>)}

          {entries.length > 0 && !reachedEnd && (
            <button
              className={styles.loadMoreBtn}
              onClick={() => setLimit((l) => l + LOAD_MORE_STEP[period])}
            >
              Show more
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default RevenueView;
