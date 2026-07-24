import { useState } from "react";
import styles from "./LoginModal.module.css";

const LoginModal = ({ onClose, onSubmit, error, loading }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [barberCode, setBarberCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, password, barberCode });
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <div className={styles.perforation} aria-hidden="true" />

        <h2 id="login-title" className={styles.modalTitle}>
          Log In
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Name
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label className={styles.label}>
            Barber Code
            <input
              className={`${styles.input} ${styles.codeInput}`}
              type="text"
              value={barberCode}
              onChange={(e) => setBarberCode(e.target.value.toUpperCase())}
              placeholder="BS-XXXXXX"
              required
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
