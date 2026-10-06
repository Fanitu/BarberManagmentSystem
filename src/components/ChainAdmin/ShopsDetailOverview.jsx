import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getShopsIncomeHistory, getShopsBarbersHistory, getShopsMonthlyExpense } from "../../api/chainShopsDetail";
import { LoadingBanner,SkeletonChart } from "../Shared/SkeletonLine";
import styles from "./ShopsDetailOverview.module.css";

const formatMoney = (n) => (n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 });

const formatLabel = (period, start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  if (period === "daily") {
    return s.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  }
  if (period === "weekly") {
    return `${s.toLocaleDateString(undefined, { day: "numeric", month: "short" })} – ${e.toLocaleDateString(undefined, { day: "numeric", month: "short" })}`;
  }
  return s.toLocaleDateString(undefined, { month: "long", year: "numeric" });
};

const PERIODS = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

const IncomeSection = () => {
  const [period, setPeriod] = useState("daily");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getShopsIncomeHistory(period)
      .then((data) => setEntries(data.entries))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div>
      <div className={styles.subtabs}>
        {PERIODS.map((p) => (
          <button key={p.id} className={`${styles.subtab} ${period === p.id ? styles.active : ""}`} onClick={() => setPeriod(p.id)}>
            {p.label}
          </button>
        ))}
      </div>
      
      {loading && <LoadingBanner/>}

      {loading && entries.length === 0 && (
        <>
          <SkeletonChart /><SkeletonChart />
        </>
      )}
      {entries.map((entry, i) => (
        <div key={i} className={styles.chartCard}>
          <h4 className={styles.chartTitle}>{formatLabel(period, entry.start, entry.end)}</h4>          
          <ResponsiveContainer width="100%" height={360}>
          <BarChart data={entry.shops} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-35} textAnchor="end" height={60}/>
              <YAxis tick={{ fontSize: 12 }}  />
              <Tooltip formatter={(v) => `${formatMoney(v)} Birr`} />
              <Bar dataKey="revenue" fill="#2f5d3a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
      {!loading && entries.length === 0 && (
        <p className={styles.hint}>No revenue recorded yet for this period.</p>
      )}
    </div>
  );
};

const BarbersSection = () => {
  const [period, setPeriod] = useState("daily");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getShopsBarbersHistory(period)
      .then((data) => setEntries(data.entries))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div>
      <div className={styles.subtabs}>
        {PERIODS.map((p) => (
          <button key={p.id} className={`${styles.subtab} ${period === p.id ? styles.active : ""}`} onClick={() => setPeriod(p.id)}>
            {p.label}
          </button>
        ))}
      </div>

      {loading && <p className={styles.hint}>Loading…</p>}
      {loading && <LoadingBanner/>}

      {loading && entries.length === 0 && (
        <>
          <SkeletonChart /><SkeletonChart />
        </>
      )}
      {entries.map((entry, i) => (
        <div key={i} className={styles.entryBlock}>
          {entry.shops.map((shop) => (
            <div key={shop.shopId} className={styles.chartCard}>
              <h4 className={styles.chartTitle}>{shop.shopName}</h4>
              <p className={styles.chartSubtitle}>{formatLabel(period, entry.start, entry.end)}</p>        
              <ResponsiveContainer width="100%" height={260}>
              <BarChart data={shop.barbers} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-35} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 12 }}  />
                    <Tooltip formatter={(v) => `${formatMoney(v)} Birr}`} />
                    <Bar dataKey="revenue" fill="#b5860b" radius={[4, 4, 0, 0]} />
                  </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      ))}
      {!loading && entries.length === 0 && (
        <p className={styles.hint}>No barbers activity recorded yet.</p>
      )}
    </div>
  );
};

const MonthlyExpenseSection = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getShopsMonthlyExpense()
      .then((data) => setShops(data.shops))
      .finally(() => setLoading(false));
  }, []);

  if (loading && shops.length === 0) {
    return (
      <div className={styles.chartCard}>
        <LoadingBanner />
        <SkeletonChart height={300} />
      </div>
    );
  }
  if (shops.length === 0) return <p className={styles.hint}>No monthly expenses recorded yet.</p>;

  return (
    <div className={styles.chartCard}>
      <h4 className={styles.chartTitle}>Current Month's Expenses</h4>
      
    <ResponsiveContainer width="100%" height={300}>
    <BarChart data={shops} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-35} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 12 }}/>
          <Tooltip formatter={(v) => `${formatMoney(v)} Birr`} />
          <Bar dataKey="expense" fill="#a33" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const SUBSECTIONS = [
  { id: "income", label: "Income" },
  { id: "barbers", label: "Barbers" },
  { id: "monthly-expense", label: "Monthly Expense" },
];

const ShopsDetailOverview = () => {
  const [sub, setSub] = useState("income");

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Shops Graphical Overview</h2>
      <div className={styles.subsectionNav}>
        {SUBSECTIONS.map((s) => (
          <button key={s.id} className={`${styles.subsectionTab} ${sub === s.id ? styles.active : ""}`} onClick={() => setSub(s.id)}>
            {s.label}
          </button>
        ))}
      </div>

      {sub === "income" && <IncomeSection />}
      {sub === "barbers" && <BarbersSection />}
      {sub === "monthly-expense" && <MonthlyExpenseSection />}
    </section>
  );
};

export default ShopsDetailOverview;