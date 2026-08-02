import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  listMonthlyExpenses,
  createMonthlyExpense,
  updateMonthlyExpense,
  deleteMonthlyExpense,
} from "../../api/monthlyExpenses";
import styles from "./ListSection.module.css";

const formatMoney = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

const MonthlyExpenseSection = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const load = () => {
    listMonthlyExpenses(token).then(setItems).catch((err) => setStatus({ type: "error", message: err.message }));
  };

  useEffect(load, [token]);

  useEffect(() => {
    if (!status.message) return;
    const timer = setTimeout(() => setStatus({ type: "", message: "" }), 3500);
    return () => clearTimeout(timer);
  }, [status.message, status.type]);


  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });
    try {
      await createMonthlyExpense(token, { name, price: Number(price) });
      setStatus({ type: "success", message: "Monthly Expense submitted Successfully." });
      setName("");
      setPrice("");
      load();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditName(item.name);
    setEditPrice(String(item.price));
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id) => {
    setStatus({ type: "", message: "" });
    try {
      await updateMonthlyExpense(token, id, { name: editName, price: Number(editPrice) });
      setStatus({ type: "success", message: "Monthly Expense Edited Successfully." });
      setEditingId(null);
      load();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleDelete = async (id) => {
    setStatus({ type: "", message: "" });
    try {
      await deleteMonthlyExpense(token, id);
      setStatus({ type: "success", message: "Monthly Expense Deleted Successfully." });
      load();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Monthly Expense</h2>

      <form onSubmit={handleCreate} className={styles.form}>
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
        <button className={styles.submitBtn} type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save Monthly expense"}
        </button>
      </form>

      <h3 className={styles.subheading}>Monthly Expense List</h3>

      <ul className={styles.list}>
        {items.map((item) =>
          editingId === item._id ? (
            <li key={item._id} className={styles.editRow}>
              <input
                className={styles.editInput}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <input
                className={`${styles.editInput} ${styles.editPriceInput} mono-figure`}
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />
              <div className={styles.editActions}>
                <button className={styles.saveBtn} onClick={() => saveEdit(item._id)}>
                  Update
                </button>
                <button className={styles.cancelBtn} onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            </li>
          ) : (
            <li key={item._id} className={styles.row}>
              <span className={styles.rowName}>{item.name}</span>
              <span className="mono-figure">{formatMoney(item.price)}</span>
              <div className={styles.rowActions}>
                <button className={styles.updateBtn} onClick={() => startEdit(item)}>
                  Update
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          )
        )}
        {items.length === 0 && <li className={styles.empty}>No monthly expenses yet.</li>}
      </ul>

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

export default MonthlyExpenseSection;
