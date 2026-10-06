import { useEffect, useState } from "react";
import styles from "./PendingApprovalBanner.module.css";

const PendingApprovalBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50); // trigger slide-in on mount
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`${styles.banner} ${visible ? styles.in : ""}`}>
      <div className={styles.icon}>⏳</div>
      <h3 className={styles.title}>Waiting for Approval</h3>
      <p className={styles.text}>
        Your account has been created. Ask your shop's admin to activate your account
        before you can start logging services or debts.
      </p>
    </div>
  );
};

export default PendingApprovalBanner;