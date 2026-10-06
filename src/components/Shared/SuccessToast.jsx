import { useEffect } from "react";
import styles from "./SuccessToast.module.css";

const SuccessToast = ({ message, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={styles.toast}>
      <span className={styles.check}>✓</span>
      <span>{message}</span>
    </div>
  );
};

export default SuccessToast;