import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getRevenueHistory,
  getDailyDetail,
  getWeeklyDetail,
  getMonthlyDetail,
} from "../../api/revenue";
import styles from "./RevenueView.module.css";

const PERIODS = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

const DEFAULT_LIMITS = { daily: 14, weekly: 8, monthly: 6 };
const LOAD_MORE_STEP = { daily: 7, weekly: 4, monthly: 3 };

const DETAIL_BUTTON_LABEL = {
  daily: "View Daily",
  weekly: "View Weekly",
  monthly: "View Monthly",
};

const DETAIL_FETCHERS = {
  daily: getDailyDetail,
  weekly: getWeeklyDetail,
  monthly: getMonthlyDetail,
};

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
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

  // Keyed by entry.start (each entry's own unique identifier).
  const [details, setDetails] = useState({});

  const changePeriod = (id) => {
    setPeriod(id);
    setLimit(DEFAULT_LIMITS[id]);
    setDetails({}); // different period -> old expanded details no longer apply
  };

  useEffect(() => {
    setLoading(true);
    setStatus({ type: "", message: "" });
    getRevenueHistory(token, period, limit)
      .then((data) => {
        setEntries(data.entries);
        setReachedEnd(data.reachedEnd);
      })
      .catch((err) => setStatus({ type: "error", message: err.message }))
      .finally(() => setLoading(false));
  }, [token, period, limit]);

  useEffect(() => {
    if (!status.message) return;
    const timer = setTimeout(() => setStatus({ type: "", message: "" }), 3500);
    return () => clearTimeout(timer);
  }, [status.message, status.type]);

  const toggleDetail = async (entry) => {
    const key = entry.start;
    const existing = details[key];

    // Already loaded -> just toggle visibility, no refetch.
    if (existing?.data) {
      setDetails((d) => ({ ...d, [key]: { ...existing, open: !existing.open } }));
      return;
    }

    setDetails((d) => ({ ...d, [key]: { open: true, loading: true, error: "", data: null } }));

    try {
      const fetchDetail = DETAIL_FETCHERS[period];
      const data = await fetchDetail(token, entry.start);
      setDetails((d) => ({ ...d, [key]: { open: true, loading: false, error: "", data } }));
    } catch (err) {
      setDetails((d) => ({
        ...d,
        [key]: { open: true, loading: false, error: err.message, data: null },
      }));
    }
  };

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

      {loading && (
        <div className={styles.loadingWrap}>
          <span className={styles.spinner} aria-hidden="true" />
          <span className={styles.hint}>Loading revenue…</span>
        </div>
      )}

      {!loading && status.type !== "error" && (
        <div className={styles.list}>
          {entries.map((entry) => {
            const detail = details[entry.start];

            return (
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
                      <span
                        className={
                          entry.profit >= 0
                            ? `${styles.cardValue} ${styles.positive} mono-figure`
                            : `${styles.cardValue} ${styles.negative} mono-figure`
                        }
                      >
                        {formatMoney(entry.profit)}
                      </span>
                    </div>
                  )}
                </div>

                <button className={styles.detailBtn} onClick={() => toggleDetail(entry)}>
                  {detail?.open ? "Hide" : DETAIL_BUTTON_LABEL[period]}
                </button>

                {detail?.open && (
                  <div className={styles.detailPanel}>
                    {detail.loading && <p className={styles.hint}>Loading…</p>}
                    {detail.error && <p className={styles.error}>{detail.error}</p>}

                    {detail.data && (
                      <>

                      
                        <div className={styles.detailBlock}>
                          <h4 className={styles.detailHeading}>Services</h4>
                          {detail.data.services.length === 0 ? (
                            <p className={styles.hint}>No services recorded.</p>
                          ) : (
                            <ul className={styles.detailList}>
                              {period === "daily"
                                ? detail.data.services.map((s) => (
                                    <li key={s.id} className={styles.detailRow}>
                                      <span>
                                        {s.barberName} — {s.serviceName}
                                      </span>
                                      <span className="mono-figure">
                                        {formatMoney(s.price)} Birr
                                      </span>
                                    </li>
                                  ))
                                : detail.data.services.map((s) => (
                                    <li
                                      key={`${s.name}|${s.price}`}
                                      className={styles.detailRow}
                                    >
                                      <span>
                                        {s.name} ({formatMoney(s.count)})
                                      </span>
                                      <span className="mono-figure">
                                        {s.count}×{formatMoney(s.price)} ={" "}
                                        {formatMoney(s.total)} Birr
                                      </span>
                                    </li>
                                  ))}
                            </ul>
                          )}
                        </div>

                        {detail.data.runningCosts.length > 0 && (
                          <div className={styles.detailBlock}>
                            <h4 className={styles.detailHeading}>Running-cost</h4>
                            <ul className={styles.detailList}>
                              {period === "daily"
                                ? detail.data.runningCosts.map((c) => (
                                    <li key={c.id} className={styles.detailRow}>
                                      <span>{c.name}</span>
                                      <span className="mono-figure">
                                        {formatMoney(c.price)} Birr
                                      </span>
                                    </li>
                                  ))
                                : detail.data.runningCosts.map((c) => (
                                    <li key={c.name} className={styles.detailRow}>
                                      <span>{c.name}</span>
                                      <span className="mono-figure">
                                        ×{c.count} = {formatMoney(c.total)} Birr
                                      </span>
                                    </li>
                                  ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {entries.length === 0 && (
            <p className={styles.hint}>No activity recorded yet for this period.</p>
          )}

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

      {status.message && (
        <div
          key={status.message}
          className={`${styles.toast} ${
              status.type === "error" ? styles.toastError : styles.toastSuccess
            }`}
          >
            {status.message}
          </div>
      )}
    </section>
  );
};

export default RevenueView;