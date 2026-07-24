import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listRunningCosts, createRunningCost } from "../api/runningCosts";
import styles from "./RunningCostForm.module.css";

const formatMoney = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

const RunningCostForm = () => {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [costs, setCosts] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    listRunningCosts(token)
      .then(setCosts)
      .catch((err) => setStatus({ type: "error", message: err.message }));
  };

  useEffect(load, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });
    try {
      await createRunningCost(token, { name, price: Number(price) });
      setStatus({ type: "success", message: "Running-cost submitted." });
      setName("");
      setPrice("");
      load();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Running-cost</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Name
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className={styles.label}>
          Price
          <input
            className={`${styles.input} mono-figure`}
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>

        {status.message && (
          <p className={status.type === "error" ? styles.error : styles.success}>
            {status.message}
          </p>
        )}

        <button className={styles.submitBtn} type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Running-cost"}
        </button>
      </form>

      {costs.length > 0 && (
        <ul className={styles.list}>
          {costs.slice(0, 10).map((c) => (
            <li key={c._id} className={styles.row}>
              <span>{c.name}</span>
              <span className="mono-figure">{formatMoney(c.price)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default RunningCostForm;
