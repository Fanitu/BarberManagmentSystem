import { useState } from "react";
import styles from "./CreateExpenseModal.module.css";

const TelegramPhoneModal = ({ onClose, onSubmit, submitting }) => {
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(phone);
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <form className={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3 className={styles.title}>Connect Telegram</h3>
        <label className={styles.label}>
          Phone Number
          <input
            className={styles.input}
            type="tel"
            placeholder="+2519XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        <div className={styles.actions}>
          <button className={styles.submitBtn} type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Start the Bot"}
          </button>
          <button className={styles.cancelBtn} type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default TelegramPhoneModal;