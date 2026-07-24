import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listTodayServiceLogs } from "../api/services";
import { listTodayDebts } from "../api/debts";
import styles from "./TodayRevenue.module.css";

const formatMoney = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

const TodayRevenue = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [debts, setDebts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([listTodayServiceLogs(token), listTodayDebts(token)])
      .then(([logData, debtData]) => {
        setLogs(logData);
        setDebts(debtData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const totalRevenue = logs.reduce((sum, l) => sum + l.price, 0);
  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Today's Total Revenue</h2>

      {loading && <p className={styles.hint}>Loading today's entries…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <>
          <div className={styles.block}>
            <h3 className={styles.blockTitle}>Services</h3>
            {logs.length === 0 ? (
              <p className={styles.hint}>No services recorded yet today.</p>
            ) : (
              <ul className={styles.list}>
                {logs.map((log) => (
                  <li key={log._id} className={styles.row}>
                    <span>
                      {log.barber?.name} — {log.service?.name}
                    </span>
                    <span className={`${styles.mono} ${styles.amount}`}>
                      {formatMoney(log.price)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>Debts</h3>
            {debts.length === 0 ? (
              <p className={styles.hint}>No debts recorded yet today.</p>
            ) : (
              <ul className={styles.list}>
                {debts.map((debt) => (
                  <li key={debt._id} className={styles.row}>
                    <span>{debt.barber?.name}</span>
                    <span className={`${styles.mono} ${styles.amountDebt}`}>
                      {formatMoney(debt.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <div className={styles.totalBar}>
        <div className={styles.totalItem}>
          <span className={styles.totalLabel}>Today's Revenue</span>
          <span className={`${styles.mono} ${styles.totalValue} ${styles.revenueValue}`}>
            {formatMoney(totalRevenue)}
          </span>
        </div>
        <div className={styles.totalDivider} aria-hidden="true" />
        <div className={styles.totalItem}>
          <span className={styles.totalLabel}>Total Debt</span>
          <span className={`${styles.mono} ${styles.totalValue} ${styles.debtValue}`}>
            {formatMoney(totalDebt)}
          </span>
        </div>
      </div>
    </section>
  );
};

export default TodayRevenue;
