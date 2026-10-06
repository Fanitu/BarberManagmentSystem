import { useEffect, useState } from "react";
import SuccessToast from "../Shared/SuccessToast";
import { listRunningCosts, createRunningCost } from "../../api/chainExpenses";
import CreateExpenseModal from "./CreateExpenseModal";
import { LoadingBanner, SkeletonGrid } from "../Shared/SkeletonLine";
import styles from "./ShopsDetailOverview.module.css";

const formatMoney = (n) => (n ?? 0).toLocaleString();
const formatDateLabel = (iso) => new Date(iso).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" });

const RunningCostSection = ({ shops }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const load = () => {
    setLoading(true);
    listRunningCosts()
      .then((data) => setEntries(data.entries))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      await createRunningCost(data);
      setModalOpen(false);
      load();
      setSuccessMessage("Running-cost created successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Running Cost</h2>
      {error && <p className={styles.error}>{error}</p>}
      {loading && <LoadingBanner text={entries.length === 0 ? "Loading…" : "Refreshing…"} />}

      {loading && entries.length === 0 && <SkeletonGrid count={2} lines={3} />}

      {entries.map((entry) => (
        <div key={entry.date} className={styles.entryBlock}>
          <h3 className={styles.chartTitle}>{formatDateLabel(entry.date)}</h3>
          {entry.shops.map((shop) => (
            <div key={shop.shopId} className={styles.chartCard}>
              <h4 className={styles.chartSubtitle} style={{ fontWeight: 700, color: "#333" }}>{shop.shopName}</h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {shop.costs.map((c) => (
                  <li key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: "0.9rem" }}>
                    <span>{c.name}</span>
                    <span className="mono-figure">{formatMoney(c.price)} Birr</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}

      {!loading && entries.length === 0 && <p className={styles.hint}>No running costs recorded in the past 7 days.</p>}

      <button className={styles.fixedCreateBtn} style={{ marginTop: 16 }} onClick={() => setModalOpen(true)}>
        + Create Running-Cost
      </button>

      {modalOpen && (
        <CreateExpenseModal
          title="Create Running-Cost"
          shops={shops}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreate}
          submitting={submitting}
        />
      )}
      {successMessage && <SuccessToast message={successMessage} onDone={() => setSuccessMessage("")} />}
    </section>
  );
};

export default RunningCostSection;