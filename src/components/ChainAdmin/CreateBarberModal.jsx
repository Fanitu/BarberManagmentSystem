import { useState } from "react";
import styles from "./CreateExpenseModal.module.css";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const CreateBarberModal = ({ shops, onClose, onSubmit, submitting }) => {
  const [shopId, setShopId] = useState(shops[0]?.id || "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentDay, setPaymentDay] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ shopId, name, phone, paymentDay: Number(paymentDay) });
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <form className={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3 className={styles.title}>Create Barber</h3>
        <label className={styles.label}>
          Shop
          <select className={styles.input} value={shopId} onChange={(e) => setShopId(e.target.value)} required>
            {shops.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label className={styles.label}>
          Name
          <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className={styles.label}>
          Phone Number
          <input className={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className={styles.label}>
          Payment Day
          <select className={styles.input} value={paymentDay} onChange={(e) => setPaymentDay(e.target.value)}>
            {WEEKDAYS.map((day, i) => <option key={i} value={i}>{day}</option>)}
          </select>
        </label>
        <div className={styles.actions}>
          <button className={styles.submitBtn} type="submit" disabled={submitting}>
            {submitting ? "Creating…" : "Create Barber"}
          </button>
          <button className={styles.cancelBtn} type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateBarberModal;