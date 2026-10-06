import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getShopsProgress } from "../../api/chainShopsDetail";
import { LoadingBanner,SkeletonChart } from "../Shared/SkeletonLine";
import styles from "./ShopsDetailOverview.module.css";

const formatMoney = (n) => (n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 });

const PERIODS = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

const ShopsProgress = () => {
  const [period, setPeriod] = useState("daily");
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getShopsProgress(period)
      .then((data) => setShops(data.shops))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Shops Progress</h2>

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

      {loading && <LoadingBanner/>}

     {loading && shops.length === 0 && (
        <>
          <SkeletonChart /><SkeletonChart />
        </>
      )}
      {shops.map((shop) => (
        <div key={shop.id} className={styles.chartCard}>
          <h4 className={styles.chartTitle}>{shop.name}</h4>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={shop.points} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} interval={0} angle={-35} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `${formatMoney(v)} Birr`} />
              <Line type="monotone" dataKey="revenue" stroke="#2f5d3a" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
      {!loading && shops.length === 0 && <p className={styles.hint}>No shops yet.</p>}
    </section>
  );
};

export default ShopsProgress;