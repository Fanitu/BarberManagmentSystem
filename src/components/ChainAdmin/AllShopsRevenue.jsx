import { useEffect, useState } from "react";
import { getShopsRevenueOverview, enterShopView } from "../../api/chainAdmin";
import { formatMoney } from "../Admin/RevenueView";
import { LoadingBanner, SkeletonGrid } from "../Shared/SkeletonLine";
import styles from "./AllShopsRevenue.module.css";

const PERIODS = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

const AllShopsRevenue = () => {
  const [period, setPeriod] = useState("daily");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getShopsRevenueOverview(period)
      .then((data) => setEntries(data.entries))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [period]);

  const openShop = async (shopId) => {
    try {
      await enterShopView(shopId);
      sessionStorage.setItem("chainAdminViewing", "1");
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>All Shops Revenue</h2>

      <div className={styles.subtabs}>
        {PERIODS.map((p) => (
          <button
            key={p.id}
            className={`${styles.subtab} ${period === p.id ? styles.active : ""}`}
            onClick={() => setPeriod(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <LoadingBanner text={entries.length === 0 ? "Loading…" : "Refreshing…"} />}

      {loading && entries.length === 0 && <SkeletonGrid count={3} lines={4} />}

      {entries.map((entry, i) => (
        <div key={i} className={styles.entryBlock}>
          <h3 className={styles.entryLabel}>{entry.label}</h3>
          <div className={styles.grid}>
            {entry.shops.map((shop) => (
              <div key={shop.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.shopName}>{shop.name}</span>
                  <span className={`${styles.code} mono-figure`}>{shop.barberCode}</span>
                </div>

                <div className={styles.row}>
                  <span>Revenue</span>
                  <span className="mono-figure">{formatMoney(shop.totalRevenue)} Birr</span>
                </div>
                <div className={styles.row}>
                  <span>Barbers Payment</span>
                  <span className="mono-figure">{formatMoney(shop.barbersPayment)} Birr</span>
                </div>
                <div className={styles.row}>
                  <span>Best Barber</span>
                  <span>{shop.bestBarber ? `${shop.bestBarber.name} (${formatMoney(shop.bestBarber.revenue)} Birr)` : "—"}</span>
                </div>
                {period === "monthly" && (
                  <div className={styles.row}>
                    <span>Monthly Expense</span>
                    <span className="mono-figure">{formatMoney(shop.monthlyExpense)} Birr</span>
                  </div>
                )}
                <div className={`${styles.row} ${styles.highlight}`}>
                  <span>{period === "monthly" ? "Net Profit" : "Total Income"}</span>
                  <span className="mono-figure">
                    {formatMoney(period === "monthly" ? shop.netProfit : shop.totalIncome)} Birr
                  </span>
                </div>

                <button className={styles.detailBtn} onClick={() => openShop(shop.id)}>
                  Detail Overview
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!loading && entries.length === 0 && <p className={styles.hint}>No revenue recorded yet.</p>}
    </section>
  );
};

export default AllShopsRevenue;