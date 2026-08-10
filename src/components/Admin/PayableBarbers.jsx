import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { listPayableBarbersToday, payBarberNow } from "../../api/payouts";
import PaySuccessModal from "./PaySuccessModal";
import styles from "./PayableBarbers.module.css";

const formatMoney = (n) => (n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

const PayableBarbers = () => {
  const { token } = useAuth();
  const [payouts, setPayouts] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [successPayout, setSuccessPayout] = useState(null);

  const load = () => {
    setLoading(true);
    setStatus({ type: "", message: "" });
    listPayableBarbersToday(token)
      .then(setPayouts)
      .catch((err) => setStatus({ type: "error", message: err.message }))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const handlePay = async (barberId) => {
    setPayingId(barberId);
    setStatus({ type: "", message: "" });
    try {
      const result = await payBarberNow(token, barberId);
      setSuccessPayout(result);
      console.log("Payment successful:", result);
      load();
    } catch (err) {
      setStatus({ type: "error", message: err.message })
    } finally {
      setPayingId(null);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>ዝኽፈል ባርበር</h2>
      <p className={styles.hint}>Barbers whose payment day is today.</p>

      {loading && (
          <div className={styles.loadingWrap}>
            <span className={styles.spinner} aria-hidden="true" />
            <span className={styles.hint}>Loading Payable Barber</span>
          </div>
        )}
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
      {!loading && status.type !== "error" && payouts.length === 0 && (
        <p className={styles.hint}>No barbers are due for payout today.</p>
      )}

      <div className={styles.list}>
        {payouts.map(({ barber,totalServicesGross, totalServicesIncome, debtAmount, finalIncome }) => (
          <div key={barber.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.barberName}>{barber.name}</span>
              <button
                className={styles.payBtn}
                onClick={() => handlePay(barber.id)}
                disabled={payingId === barber.id}
              >
                {payingId === barber.id ? "Paying…" : "Pay Now"}
              </button>
            </div>

            <div className={styles.rows}>
              <div className={styles.row}>
                <span>Total Services Gross</span>
                <span className="mono-figure">{formatMoney(totalServicesGross)}</span>
              </div>
              <div className={styles.row}>
                <span>Total Barber Income</span>
                <span className="mono-figure">{formatMoney(totalServicesIncome)}</span>
              </div>
              {debtAmount > 0 && (
                <div className={styles.row}>
                  <span>Unpaid Debt</span>
                  <span className={`mono-figure ${styles.negative}`}>
                    -{formatMoney(debtAmount)}
                  </span>
                </div>
              )}
              <div className={`${styles.row} ${styles.finalRow}`}>
                <span>Final Income</span>
                <span className="mono-figure">{formatMoney(finalIncome)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {successPayout && (
        <PaySuccessModal payout={successPayout} onClose={() => setSuccessPayout(null)} />
      )}
    </section>
  );
};

export default PayableBarbers;
