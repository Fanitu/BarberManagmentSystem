import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listBarbers, createBarber, deleteBarber } from "../api/barbers";
import styles from "./ListSection.module.css";

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const BarbersListSection = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentDay, setPaymentDay] = useState("0");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    listBarbers(token).then(setItems).catch((err) => setError(err.message));
  };

  useEffect(load, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createBarber(token, { name, phone, paymentDay: Number(paymentDay) });
      setName("");
      setPhone("");
      setPaymentDay("0");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBarber(token, id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Barbers List</h2>

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
          Phone number
          <input
            className={styles.input}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <label className={styles.label}>
          Payment Day
          <select
            className={styles.input}
            value={paymentDay}
            onChange={(e) => setPaymentDay(e.target.value)}
          >
            {WEEKDAYS.map((day, idx) => (
              <option key={day} value={idx}>
                {day}
              </option>
            ))}
          </select>
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.submitBtn} type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save Barber"}
        </button>
      </form>

      <h3 className={styles.subheading}>Barbers</h3>

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item._id} className={styles.row}>
            <span className={styles.rowName}>{item.name}</span>
            <span>{item.phone}</span>
            <span>{WEEKDAYS[item.paymentDay]}</span>
            <div className={styles.rowActions}>
              <button className={styles.deleteBtn} onClick={() => handleDelete(item._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className={styles.empty}>No barbers yet.</li>}
      </ul>
    </section>
  );
};

export default BarbersListSection;
