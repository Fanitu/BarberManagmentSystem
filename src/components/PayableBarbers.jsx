import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listPayableBarbersToday, payBarberNow } from "../api/payouts";
import styles from "./PayableBarbers.module.css";

const formatMoney = (n) => (n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

const PayableBarbers = () => {
  const { token } = useAuth();
  const [payouts, setPayouts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  const load = () => {
    setLoading(true);
    setError("");
    listPayableBarbersToday(token)
      .then(setPayouts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const handlePay = async (barberId) => {
    setPayingId(barberId);
    try {
      await payBarberNow(token, barberId);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setPayingId(null);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Payable Barbers</h2>
      <p className={styles.hint}>Barbers whose payment day is today.</p>

      {loading && <p className={styles.hint}>Loading…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && payouts.length === 0 && (
        <p className={styles.hint}>No barbers are due for payout today.</p>
      )}

      <div className={styles.list}>
        {payouts.map(({ barber, totalServicesIncome, debtAmount, finalIncome }) => (
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
                <span>Total Services Income</span>
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
    </section>
  );
};

export default PayableBarbers;
