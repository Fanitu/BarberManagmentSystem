import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { acceptAdminInvite } from "../../api/auth";
import { setAuthToken } from "../../api/client";
import styles from "./AdminSetupPage.module.css";
const AdminSetupPage = ({ token }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const data = await acceptAdminInvite({ token, name, password });
      if(data.token) setAuthToken(data.token);
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
       <h2 className={styles.title}>Set up your admin account</h2>
        <p className={styles.subtitle}>Choose a name and password for your shop.</p>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>
            Name
            <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className={styles.label}>
            Password
            <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.submitBtn} type="submit" disabled={submitting}>
           {submitting ? "Creating…" : "Create Admin Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSetupPage;

