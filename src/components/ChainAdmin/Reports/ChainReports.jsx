import { useEffect, useMemo, useState } from "react";
import ReportChart from "./ReportChart";
import ReportTable from "./ReportTable";
import SuccessToast from "../../Shared/SuccessToast";
import { fetchReport, fetchShopList } from "../../../api/reports";
import { exportCsv } from "../../../utils/exportCsv";
import { exportPdf } from "../../../utils/exportPdf";
import { LoadingBanner,SkeletonChart } from "../../Shared/SkeletonLine";
import styles from "./ChainReports.module.css";

const TABS = [
  { id: "revenue", label: "Revenue" },
  { id: "barbers", label: "Barbers" },
  { id: "services", label: "Services" },
];

const toISO = (d) => d.toISOString().slice(0, 10);

const presets = {
  Today: () => {
    const t = new Date();
    return [toISO(t), toISO(t)];
  },
  "This Week": () => {
    const t = new Date();
    const day = t.getDay() || 7;
    const start = new Date(t);
    start.setDate(t.getDate() - day + 1);
    return [toISO(start), toISO(t)];
  },
  "This Month": () => {
    const t = new Date();
    const start = new Date(t.getFullYear(), t.getMonth(), 1);
    return [toISO(start), toISO(t)];
  },
  "Last Month": () => {
    const t = new Date();
    const start = new Date(t.getFullYear(), t.getMonth() - 1, 1);
    const end = new Date(t.getFullYear(), t.getMonth(), 0);
    return [toISO(start), toISO(end)];
  },
  "Last 30 Days": () => {
    const t = new Date();
    const start = new Date(t);
    start.setDate(t.getDate() - 30);
    return [toISO(start), toISO(t)];
  },
};

const formatBirr = (n) => `${(n ?? 0).toLocaleString()} Birr`;

const ChainReports = () => {
  const [shops, setShops] = useState([]);
  const [shopId, setShopId] = useState("all");
  const [from, setFrom] = useState(presets["This Month"]()[0]);
  const [to, setTo] = useState(presets["This Month"]()[1]);
  const [tab, setTab] = useState("revenue");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchShopList().catch(() => []).then(setShops);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchReport({ shopId, from, to, tab })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [shopId, from, to, tab]);

  const subtitle = useMemo(() => {
    const shopLabel = shopId === "all" ? "All Shops" : shops.find((s) => s.id === shopId)?.name || shopId;
    const fromLabel = new Date(from).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const toLabel = new Date(to).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    return `${shopLabel} • ${fromLabel} – ${toLabel}`;
  }, [shopId, from, to, shops]);

  const applyPreset = (name) => {
    const [f, t] = presets[name]();
    setFrom(f);
    setTo(t);
  };

  const filenameBase = `${tab}_${from}_to_${to}`;

  const handleCsv = () => {
    if (!data) return;
    exportCsv({ columns: data.columns, rows: data.rows, filename: `${filenameBase}.csv` });
    setSuccessMessage("CSV file downloaded successfully!");
  };

  const handlePdf = () => {
    if (!data) return;
    exportPdf({
      columns: data.columns,
      rows: data.rows,
      title: `${TABS.find((t) => t.id === tab).label} Report`,
      subtitle,
      filename: `${filenameBase}.pdf`,
    });
    setSuccessMessage("PDF file downloaded successfully!");
  };

  return (
    <div className={styles.page}>
      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Shop</label>
          <select className={styles.select} value={shopId} onChange={(e) => setShopId(e.target.value)}>
            <option value="all">All Shops</option>
            {shops.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>From</label>
          <input type="date" className={styles.select} value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>To</label>
          <input type="date" className={styles.select} value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className={styles.presets}>
          {Object.keys(presets).map((name) => (
            <button key={name} className={styles.presetBtn} onClick={() => applyPreset(name)}>
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading && (
        <>
          <LoadingBanner text="Loading report…" />
          <div className={styles.chartRow}>
            <div className={styles.chartCard}><SkeletonChart height={320} /></div>
            <div className={styles.summaryCard}><SkeletonChart height={200} /></div>
          </div>
        </>
      )}

      {!loading && data && (
        <>
          {/* Chart + Summary */}
          <div className={styles.chartRow}>
            <div className={styles.chartCard}>
              <ReportChart columns={data.columns} rows={data.rows} />
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Total</span>
                <span className={styles.summaryValue}>{formatBirr(data.summary.total)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Average</span>
                <span className={styles.summaryValue}>{formatBirr(data.summary.average)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Top Performer</span>
                <span className={styles.summaryValue}>{data.summary.top}</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <ReportTable columns={data.columns} rows={data.rows} />

          {/* Downloads */}
          <div className={styles.downloadRow}>
            <button className={styles.csvBtn} onClick={handleCsv}>⬇ Download CSV</button>
            <button className={styles.pdfBtn} onClick={handlePdf}>⬇ Download PDF</button>
          </div>
        </>
      )}
      {successMessage && <SuccessToast message={successMessage} onDone={() => setSuccessMessage("")} />}
    </div>
  );
};

export default ChainReports;