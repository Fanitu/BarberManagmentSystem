import { useState } from "react";
import styles from "./CreateExpenseModal.module.css";

const ChangePasswordModal = ({ onClose, onSubmit, submitting, error }) => {
  const [previousPassword, setPreviousPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setLocalError("New password and confirmation don't match");
      return;
    }
    setLocalError("");
    onSubmit({ previousPassword, newPassword });
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <form className={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3 className={styles.title}>Change Password</h3>
        <label className={styles.label}>
          Previous Password
          <input
            className={styles.input}
            type="password"
            value={previousPassword}
            onChange={(e) => setPreviousPassword(e.target.value)}
            required
          />
        </label>
        <label className={styles.label}>
          New Password
          <input
            className={styles.input}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label className={styles.label}>
          Confirm Password
          <input
            className={styles.input}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {(localError || error) && <p style={{ color: "#a33", fontSize: "0.85rem", marginBottom: 10 }}>{localError || error}</p>}
        <div className={styles.actions}>
          <button className={styles.submitBtn} type="submit" disabled={submitting}>
            {submitting ? "Changing…" : "Change Password"}
          </button>
          <button className={styles.cancelBtn} type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordModal;