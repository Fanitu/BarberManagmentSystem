import { useState } from "react";
import styles from "./CreateExpenseModal.module.css";

const CreateExpenseModal = ({ title, shops, onClose, onSubmit, submitting }) => {

  const [shopId, setShopId] = useState(shops[0]?.id || "");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ shopId, name, price: Number(price) });
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <form className={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3 className={styles.title}>{title}</h3>
        <label className={styles.label}>
          Shop
          <select className={styles.input} value={shopId} onChange={(e) => setShopId(e.target.value)} required>
            {shops.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Name
          <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className={styles.label}>
          Price
          <input className={styles.input} type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </label>
        <div className={styles.actions}>
          <button className={styles.submitBtn} type="submit" disabled={submitting}>
            {submitting ? "Creating…" : title}
          </button>
          <button className={styles.cancelBtn} type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateExpenseModal;