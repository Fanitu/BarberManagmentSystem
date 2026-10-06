import { useEffect, useState } from "react";
import { getOverallProfit } from "../../api/chainExpenses";
import { LoadingBanner, SkeletonGrid } from "../Shared/SkeletonLine";
import styles from "./OverallProfit.module.css";

const formatMoney = (n) => (n ?? 0).toLocaleString();

const ShopProfitCard = ({ shop }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.shopName}>{shop.name}</span>
        <span className={`${styles.grossProfit} ${shop.grossProfit >= 0 ? styles.positive : styles.negative}`}>
          {formatMoney(shop.grossProfit)} Birr
        </span>
      </div>

      {open && (
        <div className={styles.rows}>
          <div className={styles.row}><span>Total Revenue</span><span className="mono-figure">{formatMoney(shop.totalRevenue)} Birr</span></div>
          <div className={styles.row}><span>Barbers Payment</span><span className="mono-figure">{formatMoney(shop.barbersPayment)} Birr</span></div>
          <div className={styles.row}>
            <span>Monthly Expense {!shop.isFinished && `(${shop.daysElapsed} days)`}</span>
            <span className="mono-figure">{formatMoney(shop.monthlyExpenseDisplayed)} Birr</span>
          </div>
          {shop.runningCost > 0 && (
            <div className={styles.row}><span>Running-Cost</span><span className="mono-figure">{formatMoney(shop.runningCost)} Birr</span></div>
          )}
          <div className={`${styles.row} ${styles.subtotal}`}><span>Total Income</span><span className="mono-figure">{formatMoney(shop.totalIncome)} Birr</span></div>
          <div className={`${styles.row} ${styles.highlight}`}><span>Gross Profit</span><span className="mono-figure">{formatMoney(shop.grossProfit)} Birr</span></div>
        </div>
      )}

      <button className={styles.viewBtn} onClick={() => setOpen((o) => !o)}>
        {open ? "Hide" : "View"}
      </button>
    </div>
  );
};

const OverallProfit = () => {
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOverallProfit(12)
      .then((data) => setMonths(data.months))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Overall Profit</h2>
        <LoadingBanner />
        <SkeletonGrid count={3} lines={4} />
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Overall Profit</h2>
      {error && <p className={styles.error}>{error}</p>}

      {months.map((m) => (
        <div key={`${m.year}-${m.month}`} className={styles.monthBlock}>
          <h3 className={styles.monthTitle}>{m.label}</h3>
          {!m.isFinished && (
            <p className={styles.nb}>
              NB: This analysis covers {m.daysElapsed} day{m.daysElapsed === 1 ? "" : "s"} and {m.daysLeft} day{m.daysLeft === 1 ? "" : "s"} left.
            </p>
          )}
          <div className={styles.grid}>
            {m.shops.map((shop) => (
              <ShopProfitCard key={shop.id} shop={shop} />
            ))}
          </div>
        </div>
      ))}

      {!loading && months.length === 0 && <p className={styles.hint}>No profit data recorded yet.</p>}
    </section>
  );
};

export default OverallProfit;