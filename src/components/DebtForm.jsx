import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listBarbers } from "../api/barbers";
import { createDebt } from "../api/debts";
import styles from "./DebtForm.module.css";

const DebtForm = () => {
  const { token } = useAuth();
  const [barbers, setBarbers] = useState([]);
  const [barberId, setBarberId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listBarbers(token)
      .then(setBarbers)
      .catch((err) => setStatus({ type: "error", message: err.message }));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });
    try {
      await createDebt(token, { barberId, amount: Number(amount) });
      setStatus({ type: "success", message: "Debt submitted." });
      setBarberId("");
      setAmount("");
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Debt</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Barber
          <select
            className={styles.input}
            value={barberId}
            onChange={(e) => setBarberId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a barber
            </option>
            {barbers.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          Debt Value
          <input
            className={`${styles.input} ${styles.mono}`}
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>

        {status.message && (
          <p className={status.type === "error" ? styles.error : styles.success}>
            {status.message}
          </p>
        )}

        <button className={styles.submitBtn} type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Debt"}
        </button>
      </form>
    </section>
  );
};

export default DebtForm;
